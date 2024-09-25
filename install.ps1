# Directory containing the VSIX files
$VSIX_DIR = "D:/_dev/torn-focus-ui"

# Find the VSIX file with the highest version number
$latest_vsix = Get-ChildItem -Path $VSIX_DIR -Filter "*.vsix" |
    Sort-Object { [version]($_ -split '\.')[0] }, 
                 { [version]($_ -split '\.')[1] }, 
                 { [version]($_ -split '\.')[2] } |
    Select-Object -Last 1

# Construct the full path to the latest VSIX
$latest_vsix_path = $latest_vsix.FullName

# Install the latest VSIX
code --install-extension $latest_vsix_path