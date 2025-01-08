/* eslint-disable no-unused-vars */
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import {  columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import tableDataComplex from "./variables/tableDataComplex.json";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Learning Hours"}
          subtitle={""}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Support Resources"}
          subtitle={""}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={""}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Learner Achievements"}
          subtitle={""}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Accessibility Score"}
          subtitle={""}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Support Network"}
          subtitle={""}
        />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div>
           <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        </div>
        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
