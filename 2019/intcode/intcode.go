package intcode

import (
	"os"
	"strconv"
	"strings"
)

type StatusCode = int

const (
	StatusCodeOk StatusCode = iota
	StatusCodeAwaitingInput
	StatusCodeDone
)

type IntcodeComputer struct {
	Mem            map[int]int
	InstructionPtr int
	RelativeBase   int
	Inputs         *[]int
	Outputs        *[]int
	StatusCode     StatusCode
}

func NewIntcodeComputer(ic map[int]int, inputs, outputs *[]int) IntcodeComputer {
	return IntcodeComputer{
		Mem:            ic,
		Inputs:         inputs,
		Outputs:        outputs,
		InstructionPtr: 0,
		RelativeBase:   0,
		StatusCode:     StatusCodeOk,
	}
}

func (c *IntcodeComputer) Step() StatusCode {
	// read at instruction pointer
	instruction := c.Mem[c.InstructionPtr]
	// extract opcode and modes
	instructionData := parseInstruction(instruction)
	opcode := instructionData.opcode
	modes := instructionData.modes

	c.StatusCode = StatusCodeOk

	switch opcode {
	case 1: // add
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
		dest := getWriteIdx(c.Mem, c.InstructionPtr+3, modes[2], c.RelativeBase)
		c.Mem[dest] = in1 + in2
		c.InstructionPtr += instructionSizes[1]
	case 2: // multiply
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
		dest := getWriteIdx(c.Mem, c.InstructionPtr+3, modes[2], c.RelativeBase)
		c.Mem[dest] = in1 * in2
		c.InstructionPtr += instructionSizes[2]
	case 3: // write from input
		if len(*c.Inputs) == 0 {
			c.StatusCode = StatusCodeAwaitingInput
		} else {
			dest := getWriteIdx(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
			c.Mem[dest] = (*c.Inputs)[0]
			*c.Inputs = (*c.Inputs)[1:]
			c.InstructionPtr += instructionSizes[3]
		}
	case 4: // output
		*c.Outputs = append(*c.Outputs, getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase))
		c.InstructionPtr += instructionSizes[4]
	case 5: //  jump if true
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		if in1 != 0 {
			in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
			c.InstructionPtr = in2
			break
		}
		c.InstructionPtr += instructionSizes[5]
	case 6: //  jump if false
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		if in1 == 0 {
			in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
			c.InstructionPtr = in2
			break
		}
		c.InstructionPtr += instructionSizes[6]
	case 7: // less than
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
		res := 0
		if in1 < in2 {
			res = 1
		}
		dest := getWriteIdx(c.Mem, c.InstructionPtr+3, modes[2], c.RelativeBase)
		c.Mem[dest] = int(res)
		c.InstructionPtr += instructionSizes[7]
	case 8: // equal
		in1 := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		in2 := getInputValue(c.Mem, c.InstructionPtr+2, modes[1], c.RelativeBase)
		res := 0
		if in1 == in2 {
			res = 1
		}
		dest := getWriteIdx(c.Mem, c.InstructionPtr+3, modes[2], c.RelativeBase)
		c.Mem[dest] = int(res)
		c.InstructionPtr += instructionSizes[8]
	case 9: // adjust relative base
		in := getInputValue(c.Mem, c.InstructionPtr+1, modes[0], c.RelativeBase)
		c.RelativeBase += in
		c.InstructionPtr += instructionSizes[9]
	case 99:
		c.StatusCode = StatusCodeDone
	default:
		panic("unsupported opcode")
	}

	return c.StatusCode
}

func (c *IntcodeComputer) Run() {
	for c.Step() != StatusCodeDone {
	}
}

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

var instructionSizes map[int]int = map[int]int{
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

func getInputValue(ic map[int]int, idx int, mode intcodeMode, relativeBase int) int {
	in := ic[idx]
	if mode == position {
		in = ic[in]
	} else if mode == relative {
		in = ic[in+relativeBase]
	}
	return in
}

func getWriteIdx(ic map[int]int, idx int, mode intcodeMode, relativeBase int) int {
	res := ic[idx]
	if mode == relative {
		res += relativeBase
	}
	return res
}

func parseInstruction(instruction int) instructionData {
	// from the right, first two digits are the opcode
	opcode := instruction % 100
	// subsequent digits are the mode
	instruction /= 100
	modes := []int{}
	for instruction > 0 {
		modes = append(modes, int(instruction%10))
		instruction /= 10
	}
	toPad := instructionSizes[opcode] - int(len(modes)) - 1
	for range toPad {
		modes = append(modes, 0)
	}
	return instructionData{opcode: int(opcode), modes: modes}
}

func GetIntcode(filepath string) map[int]int {
	bytes, _ := os.ReadFile(filepath)
	input := strings.Split(string(bytes), ",")
	instructions := make(map[int]int)
	for i, str := range input {
		num, err := strconv.Atoi(str)
		if err != nil {
			panic(err)
		}
		instructions[int(i)] = num
	}
	return instructions
}
