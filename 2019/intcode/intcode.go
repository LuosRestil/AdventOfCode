package intcode

import (
	"aoc2019/utils"
	"os"
	"strconv"
	"strings"
)

type intcodeMode = int

const (
	position intcodeMode = iota
	immediate
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
}

func Run(nums []int) {
	RunWithInput(nums, 0)
}

func RunWithInput(nums []int, input int) []int {
	output := []int{}
	ptr := 0

	for {
		// read at instruction pointer
		instruction := nums[ptr]
		// extract opcode and modes
		instructionData := parseInstruction(instruction)
		opcode := instructionData.opcode
		modes := instructionData.modes

		if opcode == 99 {
			break
		}
		switch opcode {
		case 1: // add
			in1 := nums[ptr+1]
			in2 := nums[ptr+2]
			dest := nums[ptr+3]
			if modes[0] == position {
				in1 = nums[in1]
			}
			if modes[1] == position {
				in2 = nums[in2]
			}
			nums[dest] = in1 + in2
			ptr += instructionSizes[1]
		case 2: // multiply
			in1 := nums[ptr+1]
			in2 := nums[ptr+2]
			if modes[0] == position {
				in1 = nums[in1]
			}
			if modes[1] == position {
				in2 = nums[in2]
			}
			dest := nums[ptr+3]
			nums[dest] = in1 * in2
			ptr += instructionSizes[2]
		case 3: // write from input
			dest := nums[ptr+1]
			nums[dest] = input
			ptr += instructionSizes[3]
		case 4: // output
			srcidx := nums[ptr+1]
			output = append(output, nums[srcidx])
			ptr += instructionSizes[4]
		case 5: //  jump if true
			in1 := nums[ptr+1]
			if modes[0] == position {
				in1 = nums[in1]
			}
			if in1 != 0 {
				in2 := nums[ptr+2]
				if modes[1] == position {
					in2 = nums[in2]
				}
				ptr = in2
				break
			}
			ptr += instructionSizes[5]
		case 6: //  jump if true
			in1 := nums[ptr+1]
			if modes[0] == position {
				in1 = nums[in1]
			}
			if in1 == 0 {
				in2 := nums[ptr+2]
				if modes[1] == position {
					in2 = nums[in2]
				}
				ptr = in2
				break
			}
			ptr += instructionSizes[6]
		case 7: // less than
			in1 := nums[ptr+1]
			if modes[0] == position {
				in1 = nums[in1]
			}
			in2 := nums[ptr+2]
			if modes[1] == position {
				in2 = nums[in2]
			}
			res := 0
			if in1 < in2 {
				res = 1
			}
			nums[ptr+3] = res
			ptr += instructionSizes[7]
		case 8: // less than
			in1 := nums[ptr+1]
			if modes[0] == position {
				in1 = nums[in1]
			}
			in2 := nums[ptr+2]
			if modes[1] == position {
				in2 = nums[in2]
			}
			res := 0
			if in1 == in2 {
				res = 1
			}
			nums[ptr+3] = res
			ptr += instructionSizes[7]
		default:
			panic("unsupported opcode")
		}
	}
	return output
}

func parseInstruction(instruction int) instructionData {
	// from the right, first two digits are the opcode
	opcode := instruction % 100
	// subsequent digits are the mode
	instruction /= 100
	modes := []int{}
	for instruction > 0 {
		modes = append(modes, instruction%10)
		instruction /= 10
	}
	toPad := instructionSizes[opcode] - len(modes) - 1
	for range toPad {
		modes = append(modes, 0)
	}
	return instructionData{opcode: opcode, modes: modes}
}

func GetIntcode(filepath string) []int {
	bytes, _ := os.ReadFile(filepath)	
	input := strings.Split(string(bytes), ",")
	instructions, _ := utils.Map(input, func (str string) (int, error) {
		num, err := strconv.Atoi(str)
		if err != nil {
			panic(err)
		}
		return num, nil
	})
	return instructions
}