import React, { useState } from "react"

interface NumberCounterProps {
  initialValue?: number
  onValueChange?: (value: number) => void
}
const MIN = 1
const NumberCounter: React.FC<NumberCounterProps> = ({
  initialValue = 0,
  onValueChange,
}) => {
  const [value, setValue] = useState(initialValue)

  const handleIncrement = () => {
    const newValue = value + 1
    if (validateInput(newValue)) {
      setValue(newValue)
      if (onValueChange && newValue >= MIN) {
        onValueChange(newValue)
      }
    }
  }

  const handleDecrement = () => {
    const newValue = value - 1
    if (validateInput(newValue)) {
      setValue(newValue)
      if (onValueChange) {
        onValueChange(newValue)
      }
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10)
    if (validateInput(newValue)) {
      if (!isNaN(newValue)) {
        setValue(newValue)
        if (onValueChange) {
          onValueChange(newValue)
        }
      }
    }
  }

  const validateInput = (newValue: number) => {
    if (newValue < MIN) {
      return false
    }
    return true
  }

  return (
    <div className="flex items-center">
      <button
        className="bg-gray-500 text-white rounded-l p-2"
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        min={MIN}
        type="number"
        className="bg-gray-100 text-center w-16 p-2"
        value={value}
        onChange={handleInputChange}
      />
      <button
        className="bg-gray-500 text-white rounded-r p-2"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  )
}

export default NumberCounter
