require("util")

local lines = lines_from("inputs/day01.txt")
local left = {}
local right = {}
for _, line in ipairs(lines) do
    local numbers = {}
    for num in string.gmatch(line, "%S+") do
        numbers[#numbers + 1] = tonumber(num)
    end
    table.insert(left, numbers[1])
    table.insert(right, numbers[2])
end
table.sort(left)
table.sort(right)

local diff = 0
for i=1,#left do
    diff = diff + math.abs(left[i] - right[i])
end
print("Part 1: "..diff)

local sim_score = 0
for _, num in ipairs(left) do
    local count = 0
    for _, r in ipairs(right) do
        if r == num then
            count = count + 1
        end
    end
    sim_score = sim_score + num * count
end
print("Part 2: "..sim_score)
