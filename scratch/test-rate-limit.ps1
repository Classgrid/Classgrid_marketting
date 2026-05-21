# Test rate limiter by sending 22 requests rapidly
# The first 20 should pass (or fail at Groq level), 
# but the 21st should return our 429 "message limit" error

$url = "http://localhost:3000/api/ask-ai"
$headers = @{ "Content-Type" = "application/json" }

for ($i = 1; $i -le 22; $i++) {
    $body = @{ question = "test message number $i" } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
        Write-Host "Request $i - Status: $($response.StatusCode) - $($response.Content.Substring(0, [Math]::Min(80, $response.Content.Length)))"
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $responseBody = ""
        try {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
        } catch {}
        
        Write-Host "Request $i - Status: $statusCode - $($responseBody.Substring(0, [Math]::Min(100, $responseBody.Length)))"
        
        if ($statusCode -eq 429) {
            Write-Host ""
            Write-Host "SUCCESS! Rate limiter kicked in at request $i!" -ForegroundColor Green
            Write-Host "Message: $responseBody" -ForegroundColor Yellow
            break
        }
    }
}
