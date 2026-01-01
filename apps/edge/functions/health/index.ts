export const handler = async () => {
  return new Response(
    JSON.stringify({ status: 'ok', service: 'payday-edge' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};
