import Dropdown from "../components/Dropdown";

function SampleDropdown() {
    return (
        <Dropdown head="Schemas" items={[
            <Dropdown head="Schema 1" items={[
                <p>Table A</p>,
                <p>Table B</p>
            ]} />,
            <Dropdown head="Schema 2" items={[
                <p>Table User</p>,
                <p>Table Player</p>
            ]} />
        ]} />
    )
}

export default function TestPage() {
    return (
        <div className="w-screen h-screen bg-slate-600 text-white flex flex-col">
            <p className="w-full text-center text-xl font-bold py-2 border-b border-black">Seggs</p>
            <div className="w-full h-full flex">
                <div className="p-5 min-w-64 h-full border-r border-black">
                    <SampleDropdown />
                </div>
            </div>
        </div>
    )
}