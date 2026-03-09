export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">User</h1>
      <p>ID: {id}</p>
    </div>
  )
}
