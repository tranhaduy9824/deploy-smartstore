import React, { useEffect, useRef } from 'react';
import { formatPrice } from '~/handle/formatPrice';

const RevenueAnalysisChart = ({ revenueData }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));
        const minRevenue = Math.min(...revenueData.map((item) => item.revenue));

        canvas.width = 900;
        canvas.height = 400;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(100, canvas.height - 50);

        revenueData.forEach((item, index) => {
            const x = 100 + index * 50;
            const y =
                canvas.height - 50 - ((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * (canvas.height - 100);
            ctx.lineTo(x, y);
        });

        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '13px Arial';
        ctx.textAlign = 'center';
        revenueData.forEach((item, index) => {
            const x = 100 + index * 50;
            const y = canvas.height - 20;
            ctx.fillText(item.day, x, y);
        });

        ctx.textAlign = 'right';
        const yAxisStep = (maxRevenue - minRevenue) / 5;
        for (let i = 0; i <= 5; i++) {
            const y = canvas.height - 50 - i * ((canvas.height - 100) / 5);
            ctx.fillText(`${formatPrice(Math.round(minRevenue + i * yAxisStep))}`, 90, y);
        }

        ctx.beginPath();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = canvas.height - 50 - i * ((canvas.height - 100) / 5);
            ctx.moveTo(100, y);
            ctx.lineTo(canvas.width - 50, y);
        }
        ctx.stroke();
    }, [revenueData]);

    return <canvas ref={canvasRef} />;
};

export default RevenueAnalysisChart;
