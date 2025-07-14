import AddBirthday from "../_component/addBirthday"
import BirthdayList from "../_component/BirthdayList"
import NotificationToggle from "../_component/NotificationToggle"
import Setting from "../_component/Setting"
import WhatsAppTest from "../_component/WhatsAppTest"

export default function Home() {
    return(
        <main className="flex-1 flex flex-col items-center px-4 py-6 max-w-5xl mx-auto w-full">
            {/* <!-- Responsive Main Content --> */}
            <div className="w-full flex flex-col md:flex-row gap-8 items-start">
                {/* <!-- Left: Form + Settings --> */}
                <div className="flex-1 flex flex-col gap-6 w-full md:w-1/2">
                    {/* <!-- Add Birthday Form --> */}
                    <AddBirthday/>
                    {/* <!-- Notification Toggle --> */}
                    {/* <NotificationToggle/> */}
                    {/* <!-- Settings Panel (collapsible) --> */}
                    {/* <Setting/> */}
                </div>
                {/* <!-- Right: Birthdays List --> */}
                <BirthdayList/>
                {/* <WhatsAppTest/> */}
            </div>
        </main>
    )
}