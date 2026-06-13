$urls = @(
    'http://localhost:3000/',
    'http://localhost:3000/projects',
    'http://localhost:3000/projects/mombasa-coastal-road',
    'http://localhost:3000/services',
    'http://localhost:3000/services/civil-engineering',
    'http://localhost:3000/blog',
    'http://localhost:3000/blog/coastal-infrastructure-resilience',
    'http://localhost:3000/company',
    'http://localhost:3000/contact'
)

foreach ($u in $urls) {
    try {
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
        $len = if ($r.Content) { $r.Content.Length } else { 0 }
        Write-Output ("{0} -> {1} ({2} chars)" -f $u, $r.StatusCode, $len)
    } catch {
        Write-Output ("{0} -> ERROR: {1}" -f $u, $_.Exception.Message)
    }
}
