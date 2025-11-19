namespace _2016.days;

public class State(char?[][] board, int moves, int floor)
{
    public char?[][] Board { get; set; } = board;
    public int Moves { get; set; } = moves;
    public int Floor { get; set; } = floor;
}

public static class Day11
{
    public static void Run()
    {
        char?[][] board1 = [
            [null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null],
            [null, 'A',  null, null, null, 'C',  null, null, null, null],
            ['a',  null, 'b',  'B',  'c',  null, 'd',  'D',  'e',  'E'],
        ];
        char?[][] board2 = [
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            [null, 'A',  null, null, null, 'C',  null, null, null, null, null, null, null, null],
            ['a',  null, 'b',  'B',  'c',  null, 'd',  'D',  'e',  'E', 'f', 'F', 'g', 'G'],
        ];
        Console.WriteLine($"Part 1: {GetSteps(board1)}");
        // Console.WriteLine($"Part 2: {GetSteps(board2)}");
    }

    private static int GetSteps(char?[][] board)
    {
        State startState = new(board, 0, 3);

        List<State> states = [startState];
        HashSet<string> seen = [];

        while (states.Count > 0)
        {
            State state = states.First();
            states.RemoveAt(0);
            if (IsWinCondition(state.Board))
                return state.Moves;

            states.AddRange(GetAdjacentStates(state, seen));
        }
        return -1;
    }

    private static bool IsValid(char?[][] board)
    {
        foreach (char?[] row in board)
        {
            bool rowHasGenerator = row.Where(c => c != null && c >= 97).Any();
            foreach (char? c in row)
            {
                if (c == null) continue;
                if (
                    rowHasGenerator &&
                    c < 91 && // uppercase (chip)
                    !row.Contains((char)(c + 32)) // corresponding lowercase (generator)
                )
                {
                    return false;
                }

            }
        }
        return true;
    }

    private static bool IsWinCondition(char?[][] board)
    {
        return board[0].All(c => c != null);
    }

    private static string Stringify(State state)
    {
        return string.Join(',', state.Board.Select(row => string.Join(',', row))) + state.Floor;
    }

    private static List<State> GetAdjacentStates(State state, HashSet<string> seen)
    {
        List<State> adjacentStates = [];

        // up
        if (state.Floor > 0)
        {
            for (int i = 0; i < state.Board[0].Length; i++)
            {
                if (state.Board[state.Floor][i] == null) continue;

                char?[][] singleMoveBoard = CopyBoard(state.Board);
                singleMoveBoard[state.Floor - 1][i] = singleMoveBoard[state.Floor][i];
                singleMoveBoard[state.Floor][i] = null;

                var singleMoveState = new State(singleMoveBoard, state.Moves + 1, state.Floor - 1);
                var singleMoveStateStr = Stringify(singleMoveState);
                if (!seen.Contains(singleMoveStateStr) && IsValid(singleMoveState.Board))
                {
                    adjacentStates.Add(singleMoveState);
                    seen.Add(singleMoveStateStr);
                }

                for (int j = i + 1; j < state.Board[0].Length; j++)
                {
                    if (state.Board[state.Floor][j] == null) continue;

                    char?[][] doubleMoveBoard = CopyBoard(singleMoveBoard);
                    doubleMoveBoard[state.Floor - 1][j] = doubleMoveBoard[state.Floor][j];
                    doubleMoveBoard[state.Floor][j] = null;

                    var doubleMoveState = new State(doubleMoveBoard, state.Moves + 1, state.Floor - 1);
                    var doubleMoveStateStr = Stringify(doubleMoveState);
                    if (!seen.Contains(doubleMoveStateStr) && IsValid(doubleMoveState.Board))
                    {
                        adjacentStates.Add(doubleMoveState);
                        seen.Add(doubleMoveStateStr);
                    }
                }
            }
        }

        // down
        if (state.Floor < state.Board.Length - 1)
        {
            for (int i = 0; i < state.Board[0].Length; i++)
            {
                if (state.Board[state.Floor][i] == null) continue;

                char?[][] singleMoveBoard = CopyBoard(state.Board);
                singleMoveBoard[state.Floor + 1][i] = singleMoveBoard[state.Floor][i];
                singleMoveBoard[state.Floor][i] = null;

                var singleMoveState = new State(singleMoveBoard, state.Moves + 1, state.Floor + 1);
                var singleMoveStateStr = Stringify(singleMoveState);
                if (!seen.Contains(singleMoveStateStr) && IsValid(singleMoveState.Board))
                {
                    adjacentStates.Add(singleMoveState);
                    seen.Add(singleMoveStateStr);
                }

                // for (int j = i + 1; j < state.Board[0].Length; j++)
                // {
                //     if (state.Board[state.Floor][j] == null) continue;

                //     char?[][] doubleMoveBoard = CopyBoard(singleMoveBoard);
                //     doubleMoveBoard[state.Floor + 1][j] = doubleMoveBoard[state.Floor][j];
                //     doubleMoveBoard[state.Floor][j] = null;

                //     var doubleMoveState = new State(doubleMoveBoard, state.Moves + 1, state.Floor + 1);
                //     var doubleMoveStateStr = Stringify(doubleMoveState);
                //     if (!seen.Contains(doubleMoveStateStr) && IsValid(doubleMoveState.Board))
                //     {
                //         adjacentStates.Add(doubleMoveState);
                //         seen.Add(doubleMoveStateStr);
                //     }
                // }
            }
        }
        return adjacentStates;
    }

    private static char?[][] CopyBoard(char?[][] board) => [.. board.Select(row => row.ToArray())];

    private static void PrintState(State state)
    {
        Console.WriteLine("######################");
        Console.WriteLine($"floor: {state.Floor}");
        foreach (char?[] row in state.Board)
            Console.WriteLine(string.Join(',', row.Select(c => c == null ? '.' : c).ToArray()));
        Console.WriteLine("######################");
    }
}
