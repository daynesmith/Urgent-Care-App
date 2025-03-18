

export default function Homepage(){
    return(
        <div className="text-center bg-[#F8F9FA] my-4 items-center py-8 backdrop-invert backdrop-opacity-10 m-auto w-4xl justify-center shadow">
            <>
                <h1 className="text-[#007BFF] text-9xl font-serif">VirtuMed</h1>
                <p>Your Health, Our Priority – Trusted Care for a Better Tomorrow.</p>
            </>
            <div className="grid grid-flow-col grid-rows-2 gap-4 p-4 m-4 font-serif text-left">
                <div>
                <h2 className ="text-2xl m-3">Communicate with your doctor</h2>
                <p>Easily message your doctor for follow-ups, concerns, or general health advice—all in one secure platform.
                    </p>
                </div>
                <div>
                <h2 className ="text-2xl m-3">Manage your appointments</h2>
                <p>Book, reschedule, or cancel appointments with just a few clicks. </p>
                </div>
                <div>
                <h2 className ="text-2xl m-3">Request prescription refills</h2>
                <p>No more waiting on hold—quickly request medication refills online and get notified when theyre ready.
                    </p>
                </div>
                <div>
                <h2 className ="text-2xl m-3">Pay your bills</h2>
                <p> Securely view and pay medical bills online with flexible payment options.</p>
                </div>
            </div>
            <img className ="object-center mx-auto "src="https://media.istockphoto.com/id/1987031546/vector/person-with-disabilities-on-therapy-in-clinic-doctor-visiting-patient-in-ward-nurse-provide.jpg?s=612x612&w=0&k=20&c=04luXMLVXC6EhWcmB4swG_OWG1qW8g4-ydB5XHwXo4U="/>
        </div>
    )

}