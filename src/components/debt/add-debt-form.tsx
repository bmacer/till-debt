"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebts } from "@/contexts/debt-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define debt categories with their colors
const DEBT_CATEGORIES = [
    { name: "Credit Cards", color: "#94A3B8" },
    { name: "Student Loans", color: "#64748B" },
    { name: "Car Loan", color: "#475569" },
    { name: "Mortgage", color: "#334155" },
    { name: "Personal Loan", color: "#1E293B" },
    { name: "Medical Debt", color: "#0F172A" },
    { name: "Other", color: "#020617" },
];

export function AddDebtForm() {
    const router = useRouter();
    const { addDebt, error } = useDebts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        category: DEBT_CATEGORIES[0].name,
        private: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Find the selected category's color
            const selectedCategory = DEBT_CATEGORIES.find(
                (cat) => cat.name === formData.category
            );

            await addDebt({
                name: formData.name,
                amount: parseFloat(formData.amount),
                category: formData.category,
                color: selectedCategory?.color,
                private: formData.private,
            });

            // Redirect to dashboard after successful submission
            router.push("/dashboard");
        } catch (err) {
            console.error("Error adding debt:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Add New Debt</CardTitle>
                <CardDescription>Enter the details of your debt to start tracking it</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Debt Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="e.g., Chase Credit Card"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                            Current Balance ($)
                        </label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        >
                            {DEBT_CATEGORIES.map((category) => (
                                <option key={category.name} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="private"
                            name="private"
                            type="checkbox"
                            checked={formData.private}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor="private" className="text-sm font-medium">
                            Make this debt private
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Adding..." : "Add Debt"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 