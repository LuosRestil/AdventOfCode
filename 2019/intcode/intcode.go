package intcode

import (
	"os"
	"strconv"
	"strings"
)

type intcodeMode = int

const (
	position intcodeMode = iota
	immediate
	relative
)

type instructionData struct {
	opcode int
	modes  []int
}

var instructionSizes map[int64]int64 = map[int64]int64{
	1: 4,
	2: 4,
	3: 2,
	4: 2,
	5: 3,
	6: 3,
	7: 4,
	8: 4,
	9: 2,
}

func getInputValue(ic map[int64]int64, idx int64, mode intcodeMode, relativeBase int64) int64 {
	in := ic[idx]
	if mode == position {
		in = ic[in]
	} else if mode == relative {
		in = ic[in+relativeBase]
	}
	return in
}

func getWriteIdx(ic map[int64]int64, idx int64, mode intcodeMode, relativeBase int64) int64 {
	res := ic[idx]
	if mode == relative {
		res += relativeBase
	}
	return res
}

func parseInstruction(instruction int64) instructionData {
	// from the right, first two digits are the opcode
	opcode := instruction % 100
	// subsequent digits are the mode
	instruction /= 100
	modes := []int{}
	for instruction > 0 {
		modes = append(modes, int(instruction%10))
		instruction /= 10
	}
	toPad := instructionSizes[opcode] - int64(len(modes)) - 1
	for range toPad {
		modes = append(modes, 0)
	}
	return instructionData{opcode: int(opcode), modes: modes}
}

func GetIntcode(filepath string) map[int64]int64 {
	bytes, _ := os.ReadFile(filepath)
	input := strings.Split(string(bytes), ",")
	instructions := make(map[int64]int64)
	for i, str := range input {
		num, err := strconv.ParseInt(str, 0, 64)
		if err != nil {
			panic(err)
		}
		instructions[int64(i)] = num
	}
	return instructions
}

func RunSimple(ic map[int64]int64, inputs []int64, inChan chan int64, outChan chan int64) []int64 {
	go func() {
		defer close(outChan)
		Run(ic, inChan, outChan)
	}()
	for _, input := range inputs {
		inChan <- input
	}
	out := []int64{}
	for val := range outChan {
		out = append(out, val)
	}
	return out
}

func Run(ic map[int64]int64, in <-chan int64, out chan<- int64) {
	var ptr int64 = 0
	var relativeBase int64 = 0

	for {
		// read at instruction pointer
		instruction := ic[int64(ptr)]
		// extract opcode and modes
		instructionData := parseInstruction(instruction)
		opcode := instructionData.opcode
		modes := instructionData.modes

		if opcode == 99 {
			break
		}
		switch opcode {
		case 1: // add
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
			dest := getWriteIdx(ic, ptr+3, modes[2], relativeBase)
			ic[dest] = in1 + in2
			ptr += instructionSizes[1]
		case 2: // multiply
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
			dest := getWriteIdx(ic, ptr+3, modes[2], relativeBase)
			ic[dest] = in1 * in2
			ptr += instructionSizes[2]
		case 3: // write from input
			dest := getWriteIdx(ic, ptr+1, modes[0], relativeBase)
			ic[dest] = <-in
			ptr += instructionSizes[3]
		case 4: // output
			out <- getInputValue(ic, ptr+1, modes[0], relativeBase)
			ptr += instructionSizes[4]
		case 5: //  jump if true
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			if in1 != 0 {
				in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
				ptr = in2
				break
			}
			ptr += instructionSizes[5]
		case 6: //  jump if false
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			if in1 == 0 {
				in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
				ptr = in2
				break
			}
			ptr += instructionSizes[6]
		case 7: // less than
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
			res := 0
			if in1 < in2 {
				res = 1
			}
			dest := getWriteIdx(ic, ptr+3, modes[2], relativeBase)
			ic[dest] = int64(res)
			ptr += instructionSizes[7]
		case 8: // equal
			in1 := getInputValue(ic, ptr+1, modes[0], relativeBase)
			in2 := getInputValue(ic, ptr+2, modes[1], relativeBase)
			res := 0
			if in1 == in2 {
				res = 1
			}
			dest := getWriteIdx(ic, ptr+3, modes[2], relativeBase)
			ic[dest] = int64(res)
			ptr += instructionSizes[8]
		case 9: // adjust relative base
			in := getInputValue(ic, ptr+1, modes[0], relativeBase)
			relativeBase += in
			ptr += instructionSizes[9]
		default:
			panic("unsupported opcode")
		}
	}
}
