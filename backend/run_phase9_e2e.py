import subprocess
import time
import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))

print("Starting backend server for test_phase9_e2e...")
server_proc = subprocess.Popen(
    [sys.executable, "run.py"],
    cwd=backend_dir,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

try:
    time.sleep(3)
    print("Running test_phase9_e2e.py...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"
    test_proc = subprocess.run(
        [sys.executable, "test_phase9_e2e.py"],
        cwd=backend_dir,
        capture_output=True,
        text=True,
        encoding="utf-8",
        env=env,
    )
    print("STDOUT:\n", test_proc.stdout)
    if test_proc.stderr:
        print("STDERR:\n", test_proc.stderr)
    assert test_proc.returncode == 0, f"test_phase9_e2e failed with code {test_proc.returncode}"
    print("test_phase9_e2e passed successfully!")
finally:
    print("Terminating backend server...")
    server_proc.terminate()
    server_proc.wait(timeout=5)
