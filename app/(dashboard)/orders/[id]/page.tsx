export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Order</h1>
      <p>ID: {id}</p>
    </div>
  )
}
