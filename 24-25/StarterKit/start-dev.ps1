Start-Process "dotnet" -ArgumentList "watch run" -WorkingDirectory "." -NoNewWindow
Start-Process "npm" -ArgumentList "run watch" -WorkingDirectory "./Frontend" -NoNewWindow