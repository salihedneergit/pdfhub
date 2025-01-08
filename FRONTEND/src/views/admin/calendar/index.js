import React, { useState, useEffect, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

const SubscriptionCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDateUsers, setSelectedDateUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch subscription data
  const fetchSubscriptionData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/users/subscriptions");
      const { users } = response.data;
  
      // Map user data to FullCalendar events
      const subscriptionEvents = users.map((user) => {
        const validDate = new Date(user.accessUntil); // Ensure this is valid
        if (isNaN(validDate)) {
          console.error(`Invalid date for user ${user.name}: ${user.accessUntil}`);
          return null; // Skip invalid dates
        }
        return {
          title: user.name,
          start: validDate,
          end: validDate,
          extendedProps: {
            email: user.email,
            isActive: user.isActive,
          },
          backgroundColor: user.isActive ? "rgba(67,24,255,0.85)" : "#FF6347",
          borderColor: user.isActive ? "rgba(67,24,255,0.85)" : "#FF6347",
        };
      }).filter(Boolean); // Filter out invalid events
  
      setEvents(subscriptionEvents);
    } catch (error) {
      toast.error("Failed to fetch subscription data.");
      console.error("Error fetching subscription data:", error);
    }
  };
  

  // Handle date click
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
  
    const usersOnDate = events
      .filter((event) => {
        const eventStartDate = event.start instanceof Date && !isNaN(event.start)
          ? event.start.toISOString().split("T")[0]
          : null;
        return eventStartDate === clickedDate;
      })
      .map((event) => ({
        name: event.title,
        email: event.extendedProps.email,
        isActive: event.extendedProps.isActive,
      }));
  
    setSelectedDateUsers(usersOnDate);
    setIsModalOpen(true);
  };
  
  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FE] p-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl lg:text-3xl font-bold text-navy-700 mb-8 text-center"
      >
        User Subscription Calendar
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[20px] bg-white shadow-md p-6"
      >
<FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  headerToolbar={{
    start: "prev,next today",
    center: "title",
    end: "dayGridMonth,dayGridWeek",
  }}
  dateClick={handleDateClick}
  height="auto"
  contentHeight="auto"
  eventContent={(eventInfo) => (
    <div className="flex justify-center">
      <button
        className={`px-3 py-1 text-sm font-bold text-white rounded-lg ${
          eventInfo.event.extendedProps.isActive
            ? "bg-[rgba(67,24,255,0.85)]"
            : "bg-red-500"
        }`}
        title={eventInfo.event.extendedProps.email} // Optional tooltip for more info
      >
        {eventInfo.event.title}
      </button>
    </div>
  )}
/>

      </motion.div>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Users Expiring on Selected Date
                  </Dialog.Title>
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {selectedDateUsers.length > 0 ? (
                        selectedDateUsers.map((user, index) => (
                          <li
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-md ${
                              user.isActive
                                ? "bg-blue-100 text-blue-900"
                                : "bg-red-100 text-red-900"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm">{user.email}</p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-md ${
                                user.isActive ? "bg-blue-200" : "bg-red-200"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </li>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No users found for this date.
                        </p>
                      )}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-[#4318ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3318e0] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SubscriptionCalendar;
