(ns advent-of-code-2022.day02
  (:require [clojure.string]))

(def input (->> (slurp "resources/inputs/day02.txt")
                (clojure.string/split-lines)))

;; Part 1
(def equivalents {\X \A \Y \B \Z \C})
(def beats {\C \B \B \A \A \C})
(defn get-score [opponent-move my-move]
  (let [my-move (get equivalents my-move)]
    (+ (- (int my-move) 64) (cond
                                   (= (get beats my-move) opponent-move) 6
                                   (= my-move opponent-move) 3
                                   :else 0))))
(def scores (->> input
                 (map #(get-score (first %) (last %)))))
(def scores-sum (reduce + scores))
(println (str "Answer 1: " scores-sum))

;; Part 2
(def required-moves
  {\A {\X \C \Y \A \Z \B} \B {\X \A \Y \B \Z \C} \C {\X \B \Y \C \Z \A}})
(defn get-score-2 [opponent-move required-result]
  (let [result-score (* 3 (- (int required-result) 88))
        required-move (get (get required-moves opponent-move) required-result)
        move-score (- (int required-move) 64)]
    (+ move-score result-score)))
(def scores-2 (->> input
                 (map #(get-score-2 (first %) (last %)))))
(def scores-sum-2 (reduce + scores-2))
(println (str "Answer 2: " scores-sum-2))