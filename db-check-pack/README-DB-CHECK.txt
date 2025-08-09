DB CHECK PACK — Online Attendance System
=======================================

This folder contains:
- online_attendance.sql (copy of your dump, with a safe name for scripts)
- Online Attendance System.sql (original name)
- create_db_and_import.sh (Linux/macOS)
- create_db_and_import.ps1 (Windows PowerShell)
- verify.sql (sanity queries to confirm import)
- .env.example (sample env for backend)

Quick Start (Windows, using PowerShell):
----------------------------------------
1) Install PostgreSQL and ensure `psql` and `createdb` are in your PATH.
2) Right-click this folder > "Copy as path" (for reference).
3) Open PowerShell in this folder.
4) If scripts are blocked: 
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
5) Run:
     .\create_db_and_import.ps1 -DbName online_attendance -User postgres -Host localhost

Quick Start (Linux/macOS):
--------------------------
1) Install PostgreSQL (psql + createdb).
2) Open a terminal in this folder.
3) Run:
     chmod +x ./create_db_and_import.sh
     ./create_db_and_import.sh online_attendance

Verify Import:
--------------
Run one of the following:
  psql -U postgres -d online_attendance -f verify.sql
or open pgAdmin and run the same queries from verify.sql.

Expected sanity:
- At least 1 row in classes (e.g., 'Math 101').
- ~9 users total across roles.
- A recent attendance code (e.g., '7523') for class_id=1.
- attendance_records may have at least 1 row.

If you see errors about authentication, update the -User/-Host flags to match your setup.
