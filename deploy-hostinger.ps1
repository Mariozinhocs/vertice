# Script de Deploy Automatizado Hostinger Staging (/hml) - Vértice
# Squad A-Team | Mario Henrique (PO) & Antigravity AI

$FtpServer   = "ftp.vertice.hubdigital360.com"
$FtpUser     = "u576215103.vertica"
$FtpPass     = "*9t5*OvjXF"
$FtpRemoteDir= "/home/u576215103/domains/vertice.hubdigital360.com/public_html/hml"
$StagingUrl  = "https://vertice.hubdigital360.com/hml"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 DEPLOY DE HOMOLOGAÇÃO: $StagingUrl " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Compila o PWA Frontend com Vite (Assets Relativos para /hml)
Write-Host "`n[1/3] Compilando Frontend React PWA (Vite)..." -ForegroundColor Yellow
npx vite build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar o frontend React com Vite." -ForegroundColor Red
    exit 1
}

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
Write-Host " 🎉 PACOTE PREPARADO PARA AMBIENTE /hml" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# 4. Upload Automático por FTP para Hostinger no diretório /hml
Write-Host "`n[FTP Upload] Iniciando transferência para $FtpServer ($FtpRemoteDir)..." -ForegroundColor Yellow

function Upload-FtpDirectory($localPath, $remoteUrl, $username, $password) {
    # Cria diretório remoto se não existir
    try {
        $makeDirReq = [System.Net.FtpWebRequest]::Create($remoteUrl)
        $makeDirReq.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $makeDirReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $makeDirReq.UseBinary = $true
        $makeDirReq.GetResponse().Close()
    } catch {
        # O diretório já existe
    }

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

                $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
                $ftpReq.ContentLength = $fileBytes.Length

                $requestStream = $ftpReq.GetRequestStream()
                $requestStream.Write($fileBytes, 0, $fileBytes.Length)
                $requestStream.Close()
                $ftpReq.GetResponse().Close()
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
