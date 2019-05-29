using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;


namespace houseMag.OfficeRDisplay.PersonMag
{
    /// <summary>
    /// HandlerPerson 的摘要说明
    /// </summary>
    public class HandlerPerson : IHttpHandler
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

        //显示所有的人员信息 2018-04-02SYF修改
        public void showAllPersonInfo(HttpContext context)
        {

            string personName = context.Request.Params["personName"];

            string sql = "select TBP.ID,TBP.PName,TBP.TitleID,TBP.Sex,TBT.TitleName,TBD.DivisionName ,TBP.PPhone , TBP.userName,TBP.password,TBP.PermissionID  from TB_Person as TBP ";
            sql += " left join TB_Title as TBT on TBT.ID=TBP.TitleID left join TB_Division as TBD on TBD.ID=TBP.DivisionID ";
            sql += " where TBP.state=1 and TBP.PName like '%" + personName + "%'";

            DataTable dt = office.QueryDataTable(sql);
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

        //获取选择框处室信息
        public void getDivisionContent(HttpContext context)
        {
            string sql = "select * from TB_Division";
            DataTable dt = office.QueryDataTable(sql);
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
        public void getPositionContent(HttpContext context)
        {
            string sql = "select * from TB_Title";
            DataTable dt = office.QueryDataTable(sql);
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
        public void IfLoginUserExist(HttpContext context)
        {
            string userName = context.Request["userName"];
            string oldUserName = context.Request["oldUserName"];

            string sql = "select * from TB_Person where userName='" + userName + "' and state='1'";
            if (oldUserName == "" || oldUserName == null)
            {

            }
            else
            {
                sql += "and userName!='" + oldUserName + "'";
            }
            DataTable dt = office.QueryDataTable(sql);
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
        //显示某个人员的详细信息
        public void showOnePersonInfo(HttpContext context)
        {
            string id = context.Request["id"];
            string sql = "select PName ,Sex,TitleName,T.ID as titleID ,RoomID,P.PPhone  from TB_Person as P  left join  TB_Title as T  on P.TitleID=T.ID where ID=" + id;
            DataTable dt = office.QueryDataTable(sql);
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


        public void MinIDPersonInfo(HttpContext context)
        {
            //string id = context.Request["id"];
            string sql = " SELECT ID,PName,TitleID,Sex,RoomID FROM TB_Person  WHERE ID=(SELECT MIN(ID) FROM TB_Person)";
            DataTable dt = office.QueryDataTable(sql);
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

        public void DelOnePerson(HttpContext context)
        {
            //int n = 0;
            string id = context.Request["id"];
            //string sql1 = "delete from TB_Person where ID="+id;
            string sql1 = "update TB_Person set state='0' where ID='" + id + "'";
            int n1 = office.ExecuteSql(sql1);
            //string sql2 = "delete from TB_Proom where PersonID=" + id;
            //int n2 = office.ExecuteSql(sql2);
            //n = n1 + n2;
            context.Response.Write(n1);
            context.Response.End();
        }

        #region 保存某个人删除（实际为隐藏）记录 2018-04-02
        public void SaveDelPersonRecord(HttpContext context)
        {
            //保存人名和房间名称
            // string ID=context.Request.Params["ID"]
            string PName = context.Request.Params["PName"];
            string HandlerID = context.Request.Params["handlerID"];

            string str = "";
            string sql = "insert into TB_OperateSave(OperateType,PersonRoomType,PersonName,HandlerID,OperateTime) values('3','2','" + PName + "','" + HandlerID + "',getdate())";
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


        #region 保存新增某个人（实际为隐藏）记录 2018-04-02
        public void SaveAddPersonRecord(HttpContext context)
        {
            //保存人名和房间名称
            string PName = context.Request.Params["PName"];
            string HandlerID = context.Request.Params["handlerID"];
            string str = "";
            string sql = "insert into TB_OperateSave(OperateType,PersonRoomType,PersonName,HandlerID,OperateTime) values('1','2','" + PName + "','" + HandlerID + "',getdate())";
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


        #region 用于删除或者增加某个人的时候添加记录（通过id获取PName）2018-04-04
        public void GetPName(HttpContext context)
        {
            string ID = context.Request["ID"];
            string sql = "select PName from TB_Person where ID =" + ID;
            DataTable dt = office.QueryDataTable(sql);
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

        #region 添加人员
        public void AddOnePerson(HttpContext context)
        {
            string PName = context.Request["PName"];
            string TitleID = context.Request["TitleID"];
            string Sex = context.Request["Sex"];
            string DivisionID = context.Request["DivisionID"];

            string PPhone = context.Request["PPhone"];
            string userName = context.Request["userName"];
            string password = context.Request["password"];
            string PermissionID = context.Request["PermissionID"];
            if (DivisionID == "Null")
            {
                DivisionID = null;
            }
            string strSql = "insert into TB_Person (PName,TitleID,Sex,DivisionID,PPhone,state,userName,password,UserState,PermissionID) values ('" + PName + "','" + TitleID + "','" + Sex + "','" + DivisionID + "','" + PPhone + "',1,'" + userName + "','" + password + "', 200 ,'" + PermissionID + "')";
            int b = office.ExecuteSql(strSql);
            context.Response.Write(b);
            context.Response.End();
        }
        #endregion

        public void UpdateOnePerson(HttpContext context)
        {
            string id = context.Request["addOrEdit"];
            string PName = context.Request["PName"];
            string TitleID = context.Request["TitleID"];
            string Sex = context.Request["Sex"];
            string DivisionID = context.Request["DivisionID"];
            string PPhone = context.Request["PPhone"];
            string userName = context.Request["userName"];
            string password = context.Request["password"];
            string PermissionID = context.Request["PermissionID"];
            string strSql = "update TB_Person set PName='" + PName + "',TitleID='" + TitleID + "',Sex='" + Sex + "',DivisionID=" + DivisionID + ",PPhone='" + PPhone + "',userName='" + userName + "',password='" + password + "',PermissionID ='" + PermissionID + "' where ID=" + id;
            int b = office.ExecuteSql(strSql);
            context.Response.Write(b);
            context.Response.End();

        }

        public void getIfHasRoom(HttpContext context)
        {
            string id = context.Request["addOrEdit"];
            string strSql = "select RoomID from TB_Person where ID =" + id;
            DataTable dt = office.QueryDataTable(strSql);
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

        //  update TB_Room set sort=(select MIN(pphone) from TB_Person where RoomID='110') WHERE ID='110'
        public void updateSort(HttpContext context)
        {
            string str = "";
            string roomID = context.Request["roomID"];
            string sql = "update TB_Room set sort=(select MIN(PPhone) from TB_Person where RoomID='" + roomID + "') where ID='" + roomID + "'";
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


        public void getPersonMultMenu(HttpContext context)
        {
            string sql = "";
            string sql1 = "";
            string sql2 = "";
            string sql3 = "";
            string sql4 = "";
            sql = "select ID,UnitName from TB_Unit";
            sql1 = "select UnitID,ID,HouseName from TB_House";
            sql2 = "select HouseID,ID,HouseSUBName from TB_HouserSUB";
            sql3 = "select distinct HouseSUBID,FloorNo from TB_Room";
            sql4 = "select HouseSUBID,FloorNo,ID,RoomName from TB_Room";
            DataTable dt = office.Query(sql).Tables[0];
            DataTable dt1 = office.Query(sql1).Tables[0];
            DataTable dt2 = office.Query(sql2).Tables[0];
            DataTable dt3 = office.Query(sql3).Tables[0];
            DataTable dt4 = office.Query(sql4).Tables[0];
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
                mRetSB.Append("],\"roomName\":[");
            }

            if (dt4.Rows.Count > 0)
            {
                foreach (DataRow row in dt4.Rows)
                {
                    mRetSB.Append("{ ");
                    foreach (DataColumn column in dt4.Columns)
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

        //获取所有房间的ID
        public void getAllRoomId(HttpContext context)
        {
            string sql = "select ID from TB_Room";
            DataTable dt = office.QueryDataTable(sql);
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

        public void getOneRoomInform(HttpContext context)
        {
            string RoomID = context.Request["RoomID"];
            string sql = "select distinct TBR.UnitID as UnitID,TBR.HouseID as HouseID,HouseSUBID,FloorNo,RoomName,FloorNo,HouseSUBName,HouseName,UnitName from TB_Room TBR ,TB_Person TBP,TB_HouserSUB TBHSUB, TB_House TBH,TB_Unit TBU where TBP.RoomID=TBR.ID and TBHSUB.ID=TBR.HouseSUBID and TBH.ID=TBR.HouseID and TBU.ID=TBR.UnitID and TBR.ID='" + RoomID + "'";
            DataTable dt = office.QueryDataTable(sql);
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
        #region 判断同处室内有无重名
        public void testPersonName(HttpContext context)
        {
            string personName = context.Request["personName"];
            string oldPersonName = context.Request["oldPersonName"];
            string divisionID = context.Request["divisionID"];
            string sql = "select PName from TB_Person where PName='" + personName + "' and state='1' ";
            if (oldPersonName == null || oldPersonName == "")
            {

            }
            else
            {
                sql += "and PName!='" + oldPersonName + "'";
            }
            if (divisionID == null || divisionID == "")
            {

            }
            else if (divisionID == "Null")
            {
                sql += "and DivisionID is null";

            }
            else
            {
                sql += "and DivisionID='" + divisionID + "'";
            }
            DataTable dt = office.QueryDataTable(sql);
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