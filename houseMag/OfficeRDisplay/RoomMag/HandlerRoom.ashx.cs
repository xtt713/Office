using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.OfficeRDisplay.RoomMag
{
    /// <summary>
    /// HandlerRoom 的摘要说明
    /// </summary>
    public class HandlerRoom : IHttpHandler
    {

        DBUtility.DbHelperSQL office = new DBUtility.DbHelperSQL("office");
        public void ProcessRequest(HttpContext context)
        {
            if (context.Request["cmd"] != null)
            {
                context.Response.ContentType = "text/plain";
                string cmd = context.Request["cmd"];
                var method = this.GetType().GetMethod(cmd);
                if (method != null)
                {
                    method.Invoke(this, new object[] { context });
                }
                context.Response.End();
            }
        }
        #region 房间详细信息
        public void roomDataTable(HttpContext context)
        {
            string UnitId = context.Request.Params["UnitID"];
            string buildingId = context.Request.Params["HouseID"];
            string houseSubId = context.Request.Params["HouseSubID"];
            string floor = context.Request.Params["Floor"];
            string RoomName = context.Request.Params["roomName"];
            string sql = "select a.ID,a.UnitID,a.HouseID,a.HouseSUBID,b.HouseSUBName,a.RoomType,a.FloorNo,c.Type,a.RoomName, a.users,a.Area,TBH.HouseName,TBU.UnitName,a.Width,a.Height from TB_Room as a ";
            sql += "inner join TB_HouserSUB as b on a.HouseSUBID=b.ID ";
            sql += "inner join TB_RType as c on a.RoomType=c.ID ";
            sql += "inner join TB_House as TBH on TBH.ID=a.HouseID ";
            sql += "inner join TB_Unit as TBU on TBU.ID=a.UnitID ";
            if (UnitId == "" || UnitId == null)
            {
            }
            else
            {
                sql += "where a.UnitID='" + UnitId + "' ";
            }
            if (buildingId == "" || buildingId == null)
            {

            }
            else
            {
                sql += "and a.HouseID='" + buildingId + "'";
            }
            if (houseSubId == "" || houseSubId == null)
            {

            }
            else
            {
                sql += "and a.HouseSUBID='" + houseSubId + "'";
            }
            if (floor == "" || floor == null)
            {

            }
            else
            {
                sql += "and a.FloorNo='" + floor + "'";
            }
            if (RoomName == "" || RoomName == null)
            {

            }
            else
            {
                sql += "and a.RoomName like '%" + RoomName + "%' ";
            }
            sql += "order by a.HouseSUBID,a.RoomName";
            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取单位信息
        public void getUnitOption(HttpContext context)
        {

            string sql = "select ID,UnitName from TB_Unit";


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取单位中的楼房信息
        public void getHouseOption(HttpContext context)
        {
            string UnitID = context.Request.Params["unitID"];
            string sql = "select ID,HouseName from TB_House where UnitID='" + UnitID + "'";


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取楼房中的分区信息
        public void getHouseSubOption(HttpContext context)
        {
            string HouseID = context.Request.Params["HouseID"];
            string sql = "select ID,HouseSUBName from TB_HouserSUB where HouseID='" + HouseID + "'";


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 获取分区中的楼层信息
        public void getFloorOption(HttpContext context)
        {
            string housesubID = context.Request.Params["housesubID"];
            string sql = "select ID,floor from TB_HouserSUB where ID='" + housesubID + "'";


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 删除房间信息
        public void deleteRoomData(HttpContext context)
        {
            //status为房间状态，TitleID为职称
            string ID = context.Request.Params["ID"];
            string str = "";
            string sql = "";
            sql = "delete from TB_Room where ID='" + ID + "'";
            int count = office.ExecuteSql(sql);
            if (count > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);

        }
        #endregion
        #region 删除房间人员RoomID为null
        public void deleteRoomPerson(HttpContext context)
        {
            //status为房间状态，TitleID为职称
            string ID = context.Request.Params["ID"];
            string str = "";
            string sql = "";
            sql = "update TB_Person set RoomID=Null where RoomID='" + ID + "'";
            int count = office.ExecuteSql(sql);
            if (count > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);

        }
        #endregion
        #region 动态获取多级select菜单内容
        public void getMultMenu(HttpContext context)
        {
            string sql = "";
            string sql1 = "";
            string sql2 = "";
            //string sql3 = "";
            sql = "select ID,UnitName from TB_Unit";
            sql1 = "select UnitID,ID,HouseName from TB_House";
            sql2 = "select HouseID,ID,HouseSUBName,floor from TB_HouserSUB";
            //sql3 = "select distinct HouseSUBID,FloorNo from TB_Room";
            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            DataTable dt2 = office.Query(sql2).Tables[0];
            //DataTable dt3 = office.Query(sql3).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                mRetSB.Append("{\"Unit\":[");
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"build\":[");
            }
            if (dt1.Rows.Count > 0)
            {
                foreach (DataRow row in dt1.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt1.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("],\"houseSub\":[");
            }
            if (dt2.Rows.Count > 0)
            {
                foreach (DataRow row in dt2.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt2.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
                mRetSB.Remove(mRetSB.Length - 1, 1);
                mRetSB.Append("]},");
            }

            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 修改房间信息
        public void editRoomData(HttpContext context)
        {
            string RoomID = context.Request.Params["RoomID"];
            string Area = context.Request.Params["Area"];
            string FloorNo = context.Request.Params["FloorNo"];
            string Width = context.Request.Params["Width"];
            string Height = context.Request.Params["Height"];
            string HouseID = context.Request.Params["HouseID"];
            string HouseSUBID = context.Request.Params["HouseSUBID"];
            string RoomName = context.Request.Params["RoomName"];
            string RoomType = context.Request.Params["RoomType"];
            string UnitID = context.Request.Params["UnitID"];
            string Users = context.Request.Params["Users"];
            string str = "";
            string sql = "update TB_Room SET Area='" + Area + "',FloorNo='" + FloorNo + "',Width='" + Width + "',Height='" + Height + "',HouseID='" + HouseID + "',HouseSUBID='" + HouseSUBID + "',RoomName='" + RoomName + "',RoomType='" + RoomType + "',UnitID='" + UnitID + "',users='" + Users + "' where ID='" + RoomID + "'";


            int count = office.ExecuteSql(sql);
            if (count > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);

        }
        #endregion

        #region 添加房间2014-04-10SYF
        public void addRoomData(HttpContext context)
        {
            string Area = context.Request.Params["Area"];
            string FloorNo = context.Request.Params["FloorNo"];
            string Width = context.Request.Params["Width"];
            string Height = context.Request.Params["Height"];
            string HouseID = context.Request.Params["HouseID"];
            string HouseSUBID = context.Request.Params["HouseSUBID"];
            string RoomName = context.Request.Params["RoomName"];
            string RoomType = context.Request.Params["RoomType"];
            string UnitID = context.Request.Params["UnitID"];
            string Users = context.Request.Params["Users"];
            string str = "";
            string sql = "insert into TB_Room(UnitID,HouseID,HouseSUBID,FloorNo,RoomType,RoomName,Area,Width,Height,sort,users) values('" + UnitID + "','" + HouseID + "','" + HouseSUBID + "','" + FloorNo + "','" + RoomType + "','" + RoomName + "','" + Area + "','" + Width + "','" + Height + "','99999999'" + ",'" + Users + "' )";

            if (office.ExecuteSql(sql) > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);
        }
        #endregion

        #region 下一个option内容(房间搜索)
        public void getNextSearchContent(HttpContext context)
        {
            string type = context.Request.Params["type"];
            string optionType = context.Request.Params["optionType"];
            string sql = "";
            switch (type)
            {
                case "1":
                    sql = "select ID,HouseName from TB_House where UnitID='" + optionType + "'";
                    break;
                case "2":
                    sql = "select ID,HouseSUBName from TB_HouserSUB where HouseID='" + optionType + "'";
                    break;
                default:
                    sql = "select distinct FloorNo from TB_Room where HouseSUBID='" + optionType + "'";
                    break;
            }


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 获取某个房间的图片信息
        public void getRoomImg(HttpContext context)
        {
            string imgType = context.Request.Params["imgType"];
            string roomID = context.Request.Params["roomID"];
            string sql = "";
            switch (imgType)
            {
                case "theRoomImg":
                    sql = "select ID,ImgPath from TB_Image where SID='" + roomID + "' and  Type='4'";
                    break;
                case "theRoomPano":
                    sql = "select ID,ImgPath from TB_Image where SID='" + roomID + "' and Type='5'";
                    break;

            }


            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        #region 删除某个图片
        public void deleteImg(HttpContext context)
        {
            string imgID = context.Request.Params["ID"];
            string sql = "";
            string str = "";
            sql = "delete From TB_Image where ID='" + imgID + "'";


            int count = office.ExecuteSql(sql);
            if (count > 0)
            {
                str = "true";
            }
            else
            {
                str = "false";
            }
            context.Response.Write(str);
        }
        #endregion
        #region 获取某个房间的人员信息
        public void getRoomPerson(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string sql = "select a.PName, b.TitleName from TB_Person a, TB_Title b  where a.RoomID = " + roomID + " and a.TitleID = b.id order by convert(int,a.PPhone)";

            DataTable dt = office.Query(sql).Tables[0];
            if (dt.Rows.Count == 0)
            {
                sql = "select a.users as PName , b.type as TitleName from TB_room a, TB_RType b  where a.ID = " + roomID + " and a.RoomType = b.id";
                dt = office.Query(sql).Tables[0];
            }
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion
        #region 测试房间名称是否重复
        public void testRoomName(HttpContext context)
        {
            string oldRoomName = context.Request.Params["oldRoomName"];
            string roomName = context.Request.Params["roomName"];
            string HouseID = context.Request.Params["HouseID"];
            string sql = "select RoomName from TB_Room where RoomName='" + roomName + "' ";
            if (oldRoomName == "" || oldRoomName == null)
            {


            }
            else
            {
                sql += "and RoomName!='" + oldRoomName + "' ";
            }
            if (HouseID == "" || HouseID == null)
            {

            }
            else
            {
                sql += "and HouseID='" + HouseID + "' ";
            }

            DataTable dt = office.Query(sql).Tables[0];
            StringBuilder mRetSB = new StringBuilder();
            mRetSB.Append("[ ");
            if (dt.Rows.Count > 0)
            {
                foreach (DataRow row in dt.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt.Columns)
                    {
                        mRetSB.Append("\"" + column.ColumnName + "\":\"" + row[column.ColumnName].ToString() + "\",");
                    }
                    mRetSB.Remove(mRetSB.Length - 1, 1);
                    mRetSB.Append("},");
                }
            }
            mRetSB.Remove(mRetSB.Length - 1, 1);
            mRetSB.Append("]");
            context.Response.Write(mRetSB.ToString());
            context.Response.End();
        }
        #endregion

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}