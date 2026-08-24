# Script de Deploy Automatizado Hostinger Staging - SGO Vértice Campo PWA
# Squad A-Team | Mario Henrique (PO) & Antigravity AI

param (
    [switch]$UploadFTP = $false
)

$FtpServer   = "ftp.vertice.hubdigital360.com"
$FtpUser     = "u576215103.vertica"
$FtpPass     = "*9t5*OvjXF"
$FtpRemoteDir= "/home/u576215103/domains/vertice.hubdigital360.com/public_html"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 INICIANDO BUILD DE HOMOLOGAÇÃO: vertice.hubdigital360.com " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Compila o PWA Frontend com Vite
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
Write-Host " 🎉 BUILD CONCLUÍDO COM SUCESSO EM: ./deploy_package" -ForegroundColor Green
Write-Host " URL Alvo: https://vertice.hubdigital360.com" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

if ($UploadFTP) {
    Write-Host "`n[FTP] Enviando arquivos para $FtpServer..." -ForegroundColor Yellow
    # Instruções de upload via FTP / Git
} else {
    Write-Host "`n📌 Próximos Passos de Deploy:" -ForegroundColor White
    Write-Host " 1. Importe o banco MySQL na Hostinger usando o arquivo:" -ForegroundColor Gray
    Write-Host "    g:\Meu Drive\Dev's\Vértice\api\database\schema.sql" -ForegroundColor Gray
    Write-Host " 2. Envie o conteúdo de 'deploy_package' para o diretório da Hostinger via FTP/FileZilla:" -ForegroundColor Gray
    Write-Host "    Servidor: $FtpServer" -ForegroundColor Gray
    Write-Host "    Usuário: $FtpUser" -ForegroundColor Gray
    Write-Host "    Pasta Remota: $FtpRemoteDir" -ForegroundColor Gray
}
