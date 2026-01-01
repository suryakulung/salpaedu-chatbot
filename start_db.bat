@echo off
echo Starting MongoDB...
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "mongo-data" --bind_ip 127.0.0.1
pause
