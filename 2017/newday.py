import sys
from pathlib import Path

day = sys.argv[1]
with open(f"{day}.py", "x") as newfile:
    newfile.write(
        f"""\
from pathlib import Path

def main():
    pass
    
if __name__ == "__main__":
main()
        """
    )

Path(f"inputs/{day}.txt").touch(exist_ok=False)