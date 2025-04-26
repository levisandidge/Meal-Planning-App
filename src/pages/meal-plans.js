//import React, { useEffect } from "react";
import React, { useEffect, useRef } from "react";
import "../styles/mealPlanner.scss";
import Layout from "../components/Layout.js";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

const MealPlanner = () => {
  const plannerRef = useRef(null);

  useEffect(() => {
    const planner = plannerRef.current;
    if (!planner) return;

    const handleInput = (e) => {
      const target = e.target;
      if (!target.classList.contains("meal")) return;

      const lines = [];
      target.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Single line of text
          lines.push(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // Divs or spans etc — treat innerText as line
          lines.push(node.innerText);
        }
      });

      const updatedLines = lines.map((line) =>
        line.startsWith("* ") ? line.replace("* ", "• ") : line,
      );

      const newHTML = updatedLines.map((line) => `<div>${line}</div>`).join("");

      if (target.innerHTML !== newHTML) {
        target.innerHTML = newHTML;

        // Restore caret at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(target);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    };

    planner.addEventListener("input", handleInput);

    return () => {
      planner.removeEventListener("input", handleInput);
    };
  }, []);

  //const MealPlanner = () => {
  return (
    <Layout>
      <div className="meal-planner-wrapper">
        <h1 className="planner-title">Weekly Meal Planner</h1>
        <div className="meal-planner" ref={plannerRef}>
          {/* Header row */}
          <div className="header-row">
            <div className="cell header empty-cell"></div>
            {mealTypes.map((meal) => (
              <div key={meal} className="cell header">
                {meal}
              </div>
            ))}
          </div>

          {/* Day rows */}
          {daysOfWeek.map((day) => (
            <div key={day} className="day-row">
              <div className="cell day-name">{day}</div>
              {mealTypes.map((_, i) => (
                <div
                  key={i}
                  className="cell meal"
                  contentEditable="true"
                  placeholder="Type here..."
                  spellCheck="true"
                  aria-label="Enter meal"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
export default MealPlanner;
