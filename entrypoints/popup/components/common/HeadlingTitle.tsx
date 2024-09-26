export default function HeadlingTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="flex justify-start flex-nowrap items-center gap-2  text-xl font-bold mt-2 mb-2">{children}</h2>
    )
}