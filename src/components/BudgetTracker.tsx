import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";
import 'react-circular-progressbar/dist/styles.css'

export default function BudgetTracker() {
    const { state, totalExpense, remainingBudget } = useBudget()
    
    const percentage = +((totalExpense / state.budget) * 100).toFixed(2)


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex justify-center">
            <CircularProgressbar
                value={percentage}
                styles={buildStyles({
                    pathColor: percentage === 100 ? '#DC2626': '#3b82f6',
                    trailColor: '#F5F5F5',
                    textSize: percentage === 100 ? 11: 8,
                    textColor: percentage === 100 ? '#DC2626': '#3b82f6',
                })}
                text={`${percentage}% spent`}
            />
        </div>

        <div className="flex flex-col justify-center items-center gap-8">
            <button
                type="button"
                className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
            >
                Reset App
            </button>

            <AmountDisplay
                label='Budget'
                amount={state.budget}
            />
            <AmountDisplay
                label='Available'
                amount={remainingBudget}
            />
            <AmountDisplay
                label='Spent'
                amount={totalExpense}
            />
        </div>
    </div>
  )
}
