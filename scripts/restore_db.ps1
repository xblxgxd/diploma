$DB_CONTAINER = "bicycle-postgres"
$DB_USER = "postgres"
$DB_NAME = "bicycle-service"
$BACKUP_FILE_NAME = "-2025-12-15_05-53.sql"
$BACKUP_PATH = "./$BACKUP_FILE_NAME"
$SCHEMA_CLEANUP_FILE = ".\clean_schema.sql"

Write-Host "--- Starting Minimal DB Restoration ---"

# 1. Очистка существующей схемы (Обязательный шаг для предотвращения ошибок 'already exists')
Write-Host "1. Cleaning existing database schema..."
$CleanupCommand = "docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < $SCHEMA_CLEANUP_FILE"
cmd /c $CleanupCommand

# 2. Восстановление данных (Ваша рабочая команда)
Write-Host "2. Starting restoration from $BACKUP_FILE_NAME..."
$RestoreCommand = "docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < $BACKUP_PATH"
cmd /c $RestoreCommand

Write-Host "--- Restoration complete. Check data. ---"
# $DB_CONTAINER = "postgres_db"
# $DB_USER = "postgres"
# $DB_NAME = "medical_center"
# $BACKUP_DIR = "./backups"
# $SCHEMA_CLEANUP_FILE = "./delete_schema.sql"

# Write-Host "--- Starting DB Restoration Process ---"
# $LATEST_BACKUP = Get-ChildItem -Path $BACKUP_DIR -Filter "*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
# if (-not $LATEST_BACKUP) {
#     Write-Host "ERROR: No backup files found in $BACKUP_DIR." -ForegroundColor Red
#     exit 1
# }
# Write-Host "Latest backup found: $($LATEST_BACKUP.Name)"
# Write-Host "1. Cleaning existing database schema..."
# try {
#     Get-Content $SCHEMA_CLEANUP_FILE | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -q 2>$null
#     Write-Host "Schema cleaned successfully." -ForegroundColor Green
# }
# catch {
#     Write-Host "ERROR: Failed to clean schema." -ForegroundColor Red
#     $_.Exception.Message
#     exit 1
# }
# Write-Host "2. Starting restoration from $($LATEST_BACKUP.Name)..."
# try {
#     Get-Content $LATEST_BACKUP.FullName | docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -q 2>$null
#     Write-Host "Restoration completed successfully." -ForegroundColor Green
# }
# catch {
#     Write-Host "ERROR: Failed to restore data from backup." -ForegroundColor Red
#     $_.Exception.Message
#     exit 1
# }
# Write-Host "--- Restoration complete. Check application functionality. ---"