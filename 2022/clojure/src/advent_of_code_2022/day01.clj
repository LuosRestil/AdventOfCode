(ns advent-of-code-2022.day01
  (:require [clojure.string]))

(def elfCals (->> (slurp "resources/inputs/day01.txt")
                  (clojure.string/split-lines)
                  (partition-by #(= "" %))
                  (remove #(= (nth % 0) ""))
                  (map #(map (fn [num] (Integer/parseInt num)) %))
                  (map #(reduce + %))
                  (sort)))
(println (str "Answer 1: " (first (take-last 1 elfCals))))
(println (str "Answer 2: " (reduce + (take-last 3 elfCals))))

(+ (+ 2 2) 2)