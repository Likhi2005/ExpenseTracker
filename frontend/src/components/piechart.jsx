import React from "react";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import Title from "./title"; // adjust the path if your Title component is elsewhere

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const DoughnutChart = ({ dt }) => {
    const data = [
        { name: "Income", value: Number(dt.income) },
        { name: "Expense", value: Number(dt.expense) },
    ];

    return (
        <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent p-4 rounded-xl shadow-md">
            <Title title="Summary" />
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DoughnutChart;
