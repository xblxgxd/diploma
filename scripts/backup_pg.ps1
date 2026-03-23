# --- БЛОК НАСТРОЕК ---
# 1. Путь к утилите pg_dump (проверьте свою версию PostgreSQL)
$PgDumpPath = "C:\Program Files\PostgreSQL\17\pgAdmin 4\runtime\pg_dump.exe"

# 2. Параметры подключения
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER= "postgres"          # Имя пользователя БД
$DB_NAME = "bicycle-service"     # Имя базы данных, которую бэкапим
$DB_PASSWORD="Hesus2016"   # Пароль пользователя

# 3. Куда сохранять
$BackupFolder = "./scripts"

# --- ЛОГИКА СКРИПТА ---

# Создаем папку для бэкапов, если её нет
if (!(Test-Path -Path $BackupFolder)) {
    New-Item -ItemType Directory -Path $BackupFolder | Out-Null
    Write-Host "Folder created: $BackupFolder" -ForegroundColor Yellow
}

# Формируем имя файла с датой (ГГГГ-ММ-ДД_ЧЧ-ММ)
$DateString = Get-Date -Format "yyyy-MM-dd_HH-mm"
$BackupFile = "$BackupFolder\$DbName-$DateString.sql"

# Устанавливаем пароль в переменную окружения процесса
# Это позволяет pg_dump подключиться без интерактивного ввода пароля
$env:PGPASSWORD = $DB_PASSWORD

try {
    Write-Host "Starting DB Back UP '$DB_NAME'..." -ForegroundColor Cyan

    # Запуск pg_dump
    # & - это оператор вызова, нужен для запуска exe с пробелами в пути
    & $PgDumpPath -h $DB_HOST -p $DB_PORT -U $DB_USER -f $BackupFile $DB_NAME

    # Проверяем, создался ли файл и имеет ли он размер > 0
    if ((Test-Path $BackupFile) -and ((Get-Item $BackupFile).Length -gt 0)) {
        Write-Host "Success! Back up saved at : $BackupFile" -ForegroundColor Green
    }
    else {
        Write-Error "Файл бэкапа не найден или пуст. Проверьте настройки."
    }
}
catch {
    Write-Error "Произошла ошибка при выполнении: $_"
}
finally {
    # Обязательно очищаем пароль из памяти сессии для безопасности
    $env:PGPASSWORD = $null
}