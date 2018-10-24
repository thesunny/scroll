import "./css/scroll.scss"
import React from "react"
import BezierEasing from "bezier-easing"
import animals from "./animals.json"

// Easing References
// https://www.npmjs.com/package/bezier-easing
// https://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp
// ease: cubic-bezier(0.25,0.1,0.25,1)
// ease-in: cubic-bezier(0.42,0,1,1)
// ease-out: cubic-bezier(0,0,0.58,1)

const easeInFn = BezierEasing(0.42, 0, 1, 1)
const easeOutFn = BezierEasing(0, 0, 0.58, 1)

const EASE_IN_MS = 400
const EASE_OUT_MS = 200

function easeIn(diff) {
  if (diff < EASE_IN_MS) return easeInFn(diff / EASE_IN_MS) * EASE_IN_MS
  // Calculated 1.7 like this:
  // console.log((easeInFn(1)-easeInFn(0.99))/.01)
  return (diff - EASE_IN_MS) * 1.7 + EASE_IN_MS
}

function easeOut(diff) {
  if (diff >= EASE_OUT_MS) return null
  return easeOutFn(diff / EASE_OUT_MS) * EASE_OUT_MS
}

function getMs() {
  return new Date().getTime()
}

export default class Scroll extends React.Component {
  up = () => {
    this.start(-1)
  }

  down = () => {
    this.start(1)
  }

  start = dir => {
    this.dir = dir
    this.animate(easeIn)
  }

  animate = animFn => {
    this.startScrollTop = this.div.scrollTop
    this.startAt = getMs()
    this.animFn = animFn
    this.__animate__()
  }

  get maxOffsetTop() {
    return this.div.scrollHeight - this.div.offsetHeight
  }

  outOfBounds(offsetTop) {
    return offsetTop > this.maxOffsetTop || offsetTop < 0
  }

  __animate__ = () => {
    if (!this.animFn) return // some edge case causes this but not sure what
    const { div } = this
    const diff = getMs() - this.startAt
    const offset = this.animFn(diff)
    if (offset == null) return delete this.animFn
    const nextScrollTop = this.startScrollTop + offset * this.dir
    this.div.scrollTop = nextScrollTop
    if (this.outOfBounds(nextScrollTop)) return this.stop()
    this.animId = requestAnimationFrame(this.__animate__)
  }

  stop = () => {
    cancelAnimationFrame(this.animId)
    if (this.animFn !== easeIn) return
    this.animate(easeOut)
  }

  render() {
    return (
      <div className="container">
        <div className="top">
          <div
            className="icon"
            onMouseDown={this.up}
            onMouseUp={this.stop}
            onMouseLeave={this.stop}
          />
        </div>
        <div className="Scroll" ref={div => (this.div = div)}>
          {animals.map(animal => (
            <div key={animal.name} className="Animal">
              {animal.name}
            </div>
          ))}
        </div>
        <div className="bottom">
          <div
            className="icon"
            onMouseDown={this.down}
            onMouseUp={this.stop}
            onMouseLeave={this.stop}
          />
        </div>
      </div>
    )
  }
}
