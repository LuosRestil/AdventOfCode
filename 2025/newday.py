import sys
from pathlib import Path

classname = sys.argv[1]
with open(f"days/{classname.capitalize()}.cs", "x") as newfile:
    newfile.write(
        f"""\
namespace _2025.days;
public static class {classname.capitalize()}
{{
    public static void Run()
    {{

    }}
}}
        """
    )

Path(f"inputs/{classname.lower()}.txt").touch(exist_ok=False)
