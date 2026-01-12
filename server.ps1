# Simple HTTP Server for Fasage Lux Landing Page
$port = 8080
$url = "http://localhost:$port/"

Write-Host "Starting Fasage Lux Landing Page Server..." -ForegroundColor Green
Write-Host "Server will be available at: $url" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "Server is running! Open your browser and navigate to: $url" -ForegroundColor Green
Write-Host ""

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") {
        $localPath = "/index.html"
    }
    
    $filePath = Join-Path $PSScriptRoot $localPath.TrimStart('/')
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $extension = [System.IO.Path]::GetExtension($filePath)
        
        # Set content type
        switch ($extension) {
            ".html" { $contentType = "text/html; charset=utf-8" }
            ".css" { $contentType = "text/css" }
            ".js" { $contentType = "application/javascript" }
            ".json" { $contentType = "application/json" }
            ".png" { $contentType = "image/png" }
            ".jpg" { $contentType = "image/jpeg" }
            ".svg" { $contentType = "image/svg+xml" }
            default { $contentType = "text/plain" }
        }
        
        $response.ContentType = $contentType
        $response.ContentLength64 = $content.Length
        $response.StatusCode = 200
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    
    $response.Close()
}
