using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace houseMag.OfficeRDisplay
{
    /// <summary>
    /// HandlerData 的摘要说明
    /// </summary>
    public class HandlerData : IHttpHandler
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
        #region 动态获取多级select菜单内容
        public void getMultMenu(HttpContext context)
        {
            string sql = "";
            string sql1 = "";
            string sql2 = "";
            string sql3 = "";
            sql = "select ID,UnitName from TB_Unit";
            sql1 = "select UnitID,ID,HouseName from TB_House";
            sql2 = "select HouseID,ID,HouseSUBName from TB_HouserSUB";
            sql3 = "select distinct HouseSUBID,FloorNo from TB_Room";
            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            DataTable dt2 = office.Query(sql2).Tables[0];
            DataTable dt3 = office.Query(sql3).Tables[0];
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
                mRetSB.Append("],\"floor\":[");
            }
            if (dt3.Rows.Count > 0)
            {
                foreach (DataRow row in dt3.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt3.Columns)
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
        #region 根据单位名称获取相应图片
        public void getUnitImg(HttpContext context)
        {
            string unitName = context.Request.Params["unitName"];
            string sql = " select * from UnitImgInfo where UnitName='" + unitName + "' ";
            
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
        
        #region 添加房间2014-04-10SYF
        public void addRoomData(HttpContext context)
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
            string str = "";
            string sql = "insert into TB_Room(UnitID,HouseID,HouseSUBID,FloorNo,RoomType,RoomName,Area,Width,Height) values('" + UnitID + "','" + HouseID + "','" + HouseSUBID + "','" + FloorNo + "','" + RoomType + "','" + RoomName + "','" + Area + "','" + Width + "','" + Height + "')";
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
        #region 某个房间内的所有人员信息
        public void RPersonTable(HttpContext context)
        {
            string RoomID = context.Request.Params["RoomID"];
            string sql = " select TBP.ID,TBP.PName,TBT.TitleName ,TBD.DivisionName,TBR.RoomName from TB_Person TBP ";
            sql += "left join TB_Title TBT on TBT.ID=TBP.TitleID ";
            sql += "left join TB_Division TBD on TBD.ID=TBP.DivisionID ";
            sql += "left join TB_Room TBR on TBR.ID=TBP.RoomID WHERE TBR.ID=TBP.RoomID and TBP.RoomID='" + RoomID + "'";
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
        #region 某个人从房间移出
        public void RemovePerson(HttpContext context)
        {
            string PersonID = context.Request.Params["PersonID"];
            string sql = "update TB_Person set RoomID =null where ID='" + PersonID + "'";
            string str = "";
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

        #region 通过PersonID找到人名和房间名
        public void getPRname(HttpContext context)
        {
            string PersonID = context.Request.Params["PersonID"];
            string sql = "select PName,RoomName,TBR.ID from TB_Person TBP,TB_Room TBR where TBP.RoomID=TBR.ID and tbp.ID='" + PersonID + "'";
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

        #region 保存某个人从房间移出记录 2018-03-30
        public void SaveRemoveRecord(HttpContext context)
        {

            //保存人名和房间名称
            string PName = context.Request.Params["PName"];
            string RoomName = context.Request.Params["RoomName"];
            string HandlerID = context.Request.Params["handlerID"];
            string str = "";
            string sql = "insert into TB_OperateSave(OperateType,PersonRoomType,RoomName,PersonName,HandlerID,OperateTime) values('2','2','" + RoomName + "','" + PName + "','" + HandlerID + "',getdate())";
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

        #region 通过roomID获取到roomName 2018-04-02
        public void getRoomName(HttpContext context)
        {
            string roomID = context.Request.Params["roomID"];
            string PersonID = context.Request.Params["PersonID"];
            string sql = "select PName, RoomName from TB_Room TBR,TB_Person TBP where TBR.ID='" + roomID + "' and TBP.ID='" + PersonID + "'";
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
        #region 列出所有的空置人员
        public void ListNullRoomPerson(HttpContext context)
        {
            //string PName = context.Request.Params["PName"];
            //string sql = "select TBP.ID,PName,DivisionName,TitleName from TB_Person TBP,TB_Division TBD,TB_Title TBT  where TBP.DivisionID=TBD.ID and TBT.ID=TBP.TitleID and RoomID is NULL and PName like '%" + PName + "%'";
            string sql = "select TBP.ID,PName,DivisionName,TitleName from TB_Person TBP,TB_Division TBD,TB_Title TBT  where TBP.DivisionID=TBD.ID and TBT.ID=TBP.TitleID and RoomID is NULL order by TBP.ID DESC";
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

        #region 让某个人员加入到某个房间
        public void JoinPerson(HttpContext context)
        {
            string PersonID = context.Request.Params["PersonID"];
            string RoomID = context.Request.Params["RoomID"];
            string sql = "update TB_Person set RoomID ='" + RoomID + "' where ID='" + PersonID + "'";
            string str = "";
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
        #region 某人移入到某个房间记录 2018-04-02
        public void SaveJoinRecord(HttpContext context)
        {
            string PName = context.Request.Params["PName"];
            string RoomName = context.Request.Params["RoomName"];
            string HandlerID = context.Request.Params["handlerID"];
            string str = "";
            string sql = "insert into TB_OperateSave(OperateType,PersonRoomType,RoomName,PersonName,HandlerID,OperateTime) values('2','1','" + RoomName + "','" + PName + "','" + HandlerID + "',getdate())";
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

        #region 通过人员搜索调度左侧的房间和人员详细信息 rpRelationSearch
        public void RpRelationSearch(HttpContext context)
        {
            string PName = context.Request.Params["PName"];
            string sql = " select  TBP.ID as PersonID,TBP.PName, TBT.TitleName,TBD.DivisionName,TBR.ID as ID,TBH.HouseName,TBHSUB.HouseSUBName,TBR.RoomName,TBR.HouseID  FROM TB_Room TBR ";
            sql += "left join TB_Person TBP on TBP.RoomID=TBR.ID ";
            sql += "LEFT JOIN TB_Title TBT on TBP.TitleID=TBT.ID ";
            sql += "left join TB_Division TBD on TBD.ID=TBP.DivisionID ";
            sql += "LEFT JOIN TB_House TBH on TBH.ID=TBR.HouseID ";
            sql += "left join TB_HouserSUB TBHSUB on TBHSUB.ID=TBR.HouseSUBID where (TBP.PName like '%" + PName + "%' or TBR.RoomName like '%" + PName + "%' )";
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