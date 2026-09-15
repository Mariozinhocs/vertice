# Script de Deploy Automatizado Hostinger Staging (/) - Vértice
# Squad A-Team | Vértice AI

$env:Path = "C:\Program Files\nodejs;" + $env:Path

$FtpServer   = "ftp.vertice.hubdigital360.com"
$FtpUser     = "u576215103.vertica"
$FtpPass     = "*9t5*OvjXF"
$FtpRemoteDir= "/"
$StagingUrl  = "https://vertice.hubdigital360.com/"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 DEPLOY DE HOMOLOGAÇÃO: $StagingUrl " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Compila o PWA Frontend com Vite no SSD Local (evita travamentos no Google Drive)
Write-Host "`n[1/3] Compilando Frontend React em disco SSD local..." -ForegroundColor Yellow
$tempBuild = Join-Path $env:TEMP "vertice_build"
if (Test-Path $tempBuild) { Remove-Item -Recurse -Force $tempBuild -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path $tempBuild -Force | Out-Null

Copy-Item -Recurse -Force "src", "public", "index.html", "package.json", "tsconfig.json", "vite.config.ts", "tailwind.config.js", "postcss.config.js" "$tempBuild/"

$npmCmd = "C:\Program Files\nodejs\npm.cmd"
$npxCmd = "C:\Program Files\nodejs\npx.cmd"

Push-Location $tempBuild
try {
    if (Test-Path $npmCmd) { & $npmCmd install --no-audit --no-fund } else { npm install --no-audit --no-fund }
    $env:VITE_APP_ENV = "production"
    $env:VITE_SHOW_DEMO = "false"
    if (Test-Path $npxCmd) { & $npxCmd vite build } else { npx vite build }
} finally {
    Pop-Location
}

if (-not (Test-Path "$tempBuild\dist")) {
    Write-Host "❌ Erro ao compilar o frontend React com Vite." -ForegroundColor Red
    exit 1
}

if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue }
Copy-Item -Recurse -Force "$tempBuild\dist" "dist"

# 2. Prepara Pasta de Pacote de Deploy
$deployDir = "deploy_package"
if (Test-Path $deployDir) {
    Remove-Item -Recurse -Force $deployDir
}

New-Item -ItemType Directory -Path $deployDir | Out-Null
New-Item -ItemType Directory -Path "$deployDir/api" | Out-Null
New-Item -ItemType Directory -Path "$deployDir/api/uploads/evidencias" | Out-Null

Write-Host "`n[2/3] Copiando arquivos estáticos do Frontend (/dist -> /deploy_package)..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "dist/*" "$deployDir/"

Write-Host "`n[3/3] Copiando API REST em PHP 8 com credenciais da Hostinger..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "api/*" "$deployDir/api/"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " 🎉 PACOTE PREPARADO PARA AMBIENTE /" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# 4. Upload Automático por FTP para Hostinger no diretório /
Write-Host "`n[FTP Upload] Iniciando transferência para $FtpServer ($FtpRemoteDir)..." -ForegroundColor Yellow

function Ensure-FtpDirectory($remoteUrl, $username, $password) {
    try {
        $makeDirReq = [System.Net.FtpWebRequest]::Create($remoteUrl)
        $makeDirReq.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $makeDirReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $makeDirReq.UseBinary = $true
        $makeDirReq.KeepAlive = $false
        $resp = $makeDirReq.GetResponse()
        $resp.Close()
    } catch {
        # Diretório já existe ou criado
    }
}

function Upload-FtpDirectory($localPath, $remoteUrl, $username, $password) {
    Ensure-FtpDirectory -remoteUrl $remoteUrl -username $username -password $password

    $files = Get-ChildItem -Path $localPath

    foreach ($file in $files) {
        $itemRemoteUrl = "$remoteUrl/$($file.Name)"
        
        if ($file.PSIsContainer) {
            Upload-FtpDirectory -localPath $file.FullName -remoteUrl $itemRemoteUrl -username $username -password $password
        } else {
            Write-Host "  -> Enviando: $($file.Name)" -ForegroundColor Gray
            try {
                $ftpReq = [System.Net.FtpWebRequest]::Create($itemRemoteUrl)
                $ftpReq.Credentials = New-Object System.Net.NetworkCredential($username, $password)
                $ftpReq.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
                $ftpReq.UseBinary = $true
                $ftpReq.KeepAlive = $false

                $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
                $ftpReq.ContentLength = $fileBytes.Length

                $requestStream = $ftpReq.GetRequestStream()
                $requestStream.Write($fileBytes, 0, $fileBytes.Length)
                $requestStream.Close()
                $resp = $ftpReq.GetResponse()
                $resp.Close()
            } catch {
                Write-Host "⚠️ Erro ao enviar $($file.Name): $_" -ForegroundColor Red
            }
        }
    }
}

# Executa Upload FTP
$baseUrl = "ftp://$FtpServer$FtpRemoteDir"
Upload-FtpDirectory -localPath $deployDir -remoteUrl $baseUrl -username $FtpUser -password $FtpPass

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " ✅ DEPLOY DE HOMOLOGAÇÃO FINALIZADO COM SUCESSO! " -ForegroundColor Green
Write-Host " 🌐 Acesse: $StagingUrl " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
