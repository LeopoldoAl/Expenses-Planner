import { categories } from "../data/categories"
import DatePicker from 'react-date-picker'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { ChangeEvent, useEffect, useState } from "react"
import { DraftExpense, Value } from "../types"
import ErrorMessage from "./ErrorMessage"
import { useBudget } from "../hooks/useBudget"

export default function ExpenseForm() {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date
    })

    const [error, setError] = useState('')
    const [previousAmount, setPreviousAmount] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if (state.editingId) {
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id===state.editingId)[0]
            
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ['amount'].includes(name)
        
        setExpense({
            ...expense,
            [name]: isAmountField ? Number(value): value
        })
    }

    const handleChangeDate = (value: Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // We valid
        if (Object.values(expense).includes('')) {
            setError("All of the fields are necessary!")
            return
        }

        // We valid what the expense does not pass the limit
        if ((expense.amount - previousAmount) > remainingBudget) {
            setError("That expense is overpassing the budget!")
            return
        }

        // We add a new expense or update it
        if (state.editingId) {
            dispatch({type: 'update-expense', payload: {expense:{id: state.editingId, ...expense}}})
        } else {
            dispatch({type: 'add-expense', payload:{expense}})
        }
        

        // Restarts the form
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date
        })

        setPreviousAmount(0)
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4
        border-blue-500 py-2">
            {state.editingId ? 'Save Changes' : 'New Expense'}
        </legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label 
                htmlFor="expenseName" 
                className="text-xl"
            >
                Expense Name:
            </label>

            <input 
                type="text" 
                id='expenseName'
                placeholder="Add the name of the Expense"
                className="bg-slate-100 p-2"
                name="expenseName"
                value={expense.expenseName}
                onChange={handleChange}
            />
        </div>


        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount" 
                className="text-xl"
            >
                Amount:
            </label>

            <input 
                type="number" 
                id='amount'
                placeholder="Add the amount of the Expense: Ex. 300"
                className="bg-slate-100 p-2"
                name="amount"
                value={expense.amount}
                onChange={handleChange}
            />
        </div>


        <div className="flex flex-col gap-2">
            <label 
                htmlFor="category" 
                className="text-xl"
            >
                Category:
            </label>

            <select 
                id='category'
                className="bg-slate-100 p-2"
                name="category"
                value={expense.category}
                onChange={handleChange}
            >
                <option value="">-- Choise --</option>
                {categories.map( category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >
                        {category.name}
                    </option>
                ))}
            </select>
        </div>

        
        <div className="flex flex-col gap-2">
            <label 
                htmlFor="amount" 
                className="text-xl"
            >
                Expense Date:
            </label>

            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input 
            type="submit" 
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? 'Save Changes' : 'Expense Register'}
        />
    </form>
  )
}
