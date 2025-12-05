import math
from pathlib import Path
import re
import time


class Vec3:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        self.mag = math.sqrt(x ** 2 + y ** 2 + z ** 2)

    def __add__(self, other):
        return Vec3(self.x + other.x, self.y + other.y, self.z + other.z)

    def manhattan(self, other):
        return abs(self.x - other.x) + abs(self.y - other.y) + abs(self.z - other.z)


class Particle:
    def __init__(self, pos: Vec3, vel: Vec3, accel: Vec3, idx: int):
        self.pos = pos
        self.vel = vel
        self.accel = accel
        self.idx = idx

    def tick(self):
        self.vel += self.accel
        self.pos += self.vel


def main():
    particles = [parse_particle(line, i) for i, line in enumerate(
        Path("inputs/day20.txt").read_text().splitlines())]
    particles.sort(key=lambda x: (x.accel.mag, x.vel.mag, x.pos.mag))
    print([f"{p.idx}: {p.accel.mag}" for p in particles[:5]])
    # Part 1: tried all the lowest accel

    loop_start = time.time()
    dead = set()
    for _ in range(100):
        for i in range(len(particles) - 1):
            p1 = particles[i]
            if p1 in dead:
                continue
            p1_dead = False
            for j in range(i + 1, len(particles)):
                p2 = particles[j]
                if p2 in dead:
                    continue
                dist = p1.pos.manhattan(p2.pos)
                if dist == 0:
                    dead.add(p2)
                    p1_dead = True
            if p1_dead:
                dead.add(p1)
        for particle in particles:
            particle.tick()
    print(f"Part 2: {len(particles) - len(dead)}")
    loop_end = time.time()
    print(f"Loop time: {loop_end-loop_start:.4f} seconds")


def parse_particle(line: str, idx: int) -> Particle:
    sp = line.split(', ')
    pos_match = re.search(r"<.+>", sp[0])
    vel_match = re.search(r"<.+>", sp[1])
    accel_match = re.search(r"<.+>", sp[2])
    assert pos_match != None and vel_match != None and accel_match != None
    pos_nums = [int(num) for num in pos_match.group()[1:-1].split(',')]
    vel_nums = [int(num) for num in vel_match.group()[1:-1].split(',')]
    accel_nums = [int(num) for num in accel_match.group()[1:-1].split(',')]
    return Particle(
        Vec3(pos_nums[0], pos_nums[1], pos_nums[2]),
        Vec3(vel_nums[0], vel_nums[1], vel_nums[2]),
        Vec3(accel_nums[0], accel_nums[1], accel_nums[2]),
        idx
    )


if __name__ == "__main__":
    start = time.time()
    main()
    end = time.time()
    print(f"Execution time: {end-start:.4f} seconds")
