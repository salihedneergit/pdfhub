import React, { useEffect, useState } from "react";
import { Shield, ShieldAlert, AlertCircle, Printer } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const FlaggedUsers = () => {
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlaggedUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/flagged/flagged-users");
        const data = await response.json();

        if (data.success) {
          setFlaggedUsers(data.flaggedUsers);
        } else {
          throw new Error("Failed to fetch flagged users.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlaggedUsers();
  }, []);

  const generatePDF = async (user) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user._id}/details`);
      const userDetails = await response.json();
  
      if (userDetails.success) {
        const doc = new jsPDF();
  
        const backgroundColor = [255, 255, 255]; // Dark gray background
        const textColor = [255, 255, 255]; // White text
        const headerColor = [48, 50, 54]; // Slightly lighter gray
        const accentColor = [67, 160, 255]; // Blue for headers
  
        // Set Background
        doc.setFillColor(...backgroundColor);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
  
        // Title Section
        doc.setFontSize(20);
        doc.setTextColor(...textColor);
        doc.text("User Report", 14, 15);
  
        // User Information Table
        doc.autoTable({
          startY: 25,
          head: [["Field", "Value"]],
          body: [
            ["Name", userDetails.user.name],
            ["Email", userDetails.user.email],
            ["Streak", userDetails.user.streak?.streakCount || "N/A"],
            ["Longest Streak", userDetails.user.streak?.longestCount || "N/A"],
            ["Registered IP", userDetails.user.registeredIp || "N/A"],
            ["Account Created", new Date(userDetails.user.createdAt).toLocaleString()],
          ],
          theme: "grid",
          styles: {
            fillColor: headerColor,
            textColor: textColor,
            cellPadding: 6,
          },
          headStyles: {
            fillColor: accentColor,
            textColor: textColor,
          },
          alternateRowStyles: {
            fillColor: [44, 44, 44], // Alternate row color
          },
        });
  
        let startY = doc.lastAutoTable.finalY + 10;
  
        // Add Reason for Flagging
        const reasons = [];
  
        if (userDetails.user.flagged?.ipFlag?.length >= 3) {
          reasons.push(`User detected ${userDetails.user.flagged.ipFlag.length} unique IPs.`);
        }
  
        const groupedLoginCounts = userDetails.user.flagged?.loginFlag?.reduce((acc, flag) => {
          const date = new Date(flag.date).toLocaleDateString();
          acc[date] = acc[date] ? acc[date] + flag.devices.length : flag.devices.length;
          return acc;
        }, {});
  
        if (groupedLoginCounts) {
          Object.entries(groupedLoginCounts).forEach(([date, count]) => {
            if (count > 3) reasons.push(`${date}: User made ${count} logins.`);
          });
        }
  
        if (reasons.length === 2) {
          reasons.push("User made both violations.");
        }
  
        doc.setTextColor(...textColor);
        doc.text("Reasons for Flagging:", 14, startY);
        startY += 5;
  
        doc.autoTable({
          head: [["Reason"]],
          body: reasons.map((reason) => [reason]),
          startY,
          theme: "grid",
          styles: { fillColor: headerColor, textColor: textColor, cellPadding: 6 },
          headStyles: { fillColor: accentColor },
        });
  
        startY = doc.lastAutoTable.finalY + 10;
  
        // Add Purchased Courses
        if (userDetails.user.courseSelection?.length > 0) {
          doc.setTextColor(...textColor);
          doc.text("Purchased Courses:", 14, startY);
  
          doc.autoTable({
            head: [["Course Name"]],
            body: userDetails.user.courseSelection.map((course) => [course]),
            startY: startY + 5,
            theme: "grid",
            styles: { fillColor: headerColor, textColor: textColor, cellPadding: 6 },
            headStyles: { fillColor: accentColor },
          });
  
          startY = doc.lastAutoTable.finalY + 10;
        } else {
          doc.setTextColor(...textColor);
          doc.text("Purchased Courses: None", 14, startY);
          startY += 10;
        }
  
        // Add IP Flags
        if (userDetails.user.flagged?.ipFlag?.length > 0) {
          doc.setTextColor(...textColor);
          doc.text("IP Flags:", 14, startY);
  
          doc.autoTable({
            head: [["IP Address", "Detection Date"]],
            body: userDetails.user.flagged.ipFlag.map((flag) => [
              flag.ip,
              new Date(flag.date).toLocaleString(),
            ]),
            startY: startY + 5,
            theme: "grid",
            styles: { fillColor: headerColor, textColor: textColor, cellPadding: 6 },
            headStyles: { fillColor: accentColor },
          });
  
          startY = doc.lastAutoTable.finalY + 10;
        } else {
          doc.setTextColor(...textColor);
          doc.text("IP Flags: None", 14, startY);
          startY += 10;
        }
  
        // Add Login Flags
        if (userDetails.user.flagged?.loginFlag?.length > 0) {
          doc.setTextColor(...textColor);
          doc.text("Login Flags:", 14, startY);
  
          const groupedByDate = userDetails.user.flagged.loginFlag.reduce((acc, flag) => {
            const date = new Date(flag.date).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(...flag.devices);
            return acc;
          }, {});
  
          const tableData = [];
          for (const [date, devices] of Object.entries(groupedByDate)) {
            devices.forEach((device) => {
              tableData.push([
                date,
                `${device.deviceInfo?.browser || "N/A"} - ${device.deviceInfo?.os || "N/A"}`,
                device.ip || "N/A",
                device.lastLogin ? new Date(device.lastLogin).toLocaleString() : "N/A",
              ]);
            });
          }
  
          doc.autoTable({
            head: [["Date", "Device Info", "IP Address", "Last Login"]],
            body: tableData,
            startY: startY + 5,
            theme: "grid",
            styles: { fillColor: headerColor, textColor: textColor, cellPadding: 6 },
            headStyles: { fillColor: accentColor },
          });
  
          startY = doc.lastAutoTable.finalY + 10;
        } else {
          doc.setTextColor(...textColor);
          doc.text("Login Flags: None", 14, startY);
        }
  
        // Save the PDF
        doc.save(`${userDetails.user.name}_Report.pdf`);
      } else {
        throw new Error("Failed to fetch user details.");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Error generating report. Please try again.");
    }
  };
  
  
  
  
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-gray-500">Loading flagged users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Flagged Users</h1>
      {flaggedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-gray-600">No flagged users found.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Flagged Type
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {flaggedUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-gray-800">
                      <div className="flex items-center justify-center gap-3">
                        {user.flaggedType === "low" && (
                          <Shield className="h-5 w-5 text-yellow-500" />
                        )}
                        {user.flaggedType === "medium" && (
                          <ShieldAlert className="h-5 w-5 text-orange-500" />
                        )}
                        {user.flaggedType === "high/danger" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{user.flaggedType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => generatePDF(user)}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition"
                      >
                        <Printer className="h-4 w-4" />
                        Print Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedUsers;
