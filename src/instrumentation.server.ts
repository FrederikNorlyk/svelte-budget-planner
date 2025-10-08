import { registerOTel } from '@vercel/otel';

registerOTel({
	serviceName: 'svelte-budget-planner'
});
