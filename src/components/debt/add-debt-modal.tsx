"use client";

import { useState } from "react";
import { useDebts } from "@/contexts/debt-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

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

interface AddDebtModalProps {
    className?: string;
    triggerClassName?: string;
    triggerText?: string;
    isPlaceholder?: boolean;
}

export function AddDebtModal({
    className,
    triggerClassName,
    triggerText = "Add Debt",
    isPlaceholder = false
}: AddDebtModalProps) {
    const { addDebt, error } = useDebts();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        category: DEBT_CATEGORIES[0].name,
        private: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === "checkbox") {
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

            // Reset form and close dialog
            setFormData({
                name: "",
                amount: "",
                category: DEBT_CATEGORIES[0].name,
                private: false,
            });
            setIsOpen(false);
        } catch (err) {
            console.error("Error adding debt:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {isPlaceholder ? (
                <DialogTrigger asChild>
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <Plus className="h-12 w-12 text-slate-400 mb-4" />
                        <span className="text-lg font-medium text-slate-600">{triggerText}</span>
                        <span className="text-sm text-slate-500 text-center mt-2">Track a new debt in your journey</span>
                    </div>
                </DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button className={triggerClassName}>
                        <Plus className="mr-2 h-4 w-4" />
                        {triggerText}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className={`sm:max-w-[425px] ${className}`}>
                <DialogHeader>
                    <DialogTitle>Add New Debt</DialogTitle>
                    <DialogDescription>
                        Enter the details of your debt to start tracking it
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Debt Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Chase Credit Card"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Current Balance ($)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
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
                        <Label htmlFor="private">Make this debt private</Label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Adding..." : "Add Debt"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 