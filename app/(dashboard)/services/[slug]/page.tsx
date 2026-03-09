export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Service</h1>
      <p>Slug: {slug}</p>
    </div>
  )
}
