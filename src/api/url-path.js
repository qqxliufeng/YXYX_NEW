/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 14:09:14
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:38:21
 */

export const baseImageIp = 'http://118.190.3.78'

export const baseIp = 'http://192.168.0.123:8880'

// export const baseIp = 'http://118.190.3.78:8881'

/**
 * 基础模块名字
 */
const baseModuleUrl = '/yx/'

// ****************系统管理 --- 用户管理 **************** //

export const queryYouXingUserList = baseModuleUrl + 'queryYouXingUserList'

export const queryYouXingUserListByLike = baseModuleUrl + 'queryYouXingUserListByLike'

export const saveUser = baseModuleUrl + 'saveUser'

export const updateUser = baseModuleUrl + 'updateUser'

export const deleteUsers = baseModuleUrl + 'deleteUsers'

export const editPassword = baseModuleUrl + 'editPassword'

export const queryRolesByDeptId = baseModuleUrl + 'queryRolesByDeptId'

// ****************系统管理 --- 用户管理 **************** //

// ****************系统管理 --- 部门管理 **************** //

export const queryDepts = baseModuleUrl + 'queryDepts'

export const updateDept = baseModuleUrl + 'updateDept'

export const deleteDepts = baseModuleUrl + 'deleteDepts'

export const saveDept = baseModuleUrl + 'saveDept'

// ****************系统管理 --- 部门管理 **************** //

// ****************系统管理 --- 角色管理 **************** //

export const queryRoles = baseModuleUrl + 'queryRoles'

export const saveRole = baseModuleUrl + 'saveRole'

export const updateRole = baseModuleUrl + 'updateRole'

export const deleteRole = baseModuleUrl + 'deleteRole'

export const saveRoleMenus = baseModuleUrl + 'saveRoleMenus'

export const queryAllMenuByRole = baseModuleUrl + 'queryAllMenuByRole'

// ****************系统管理 --- 角色管理 **************** //

// ****************系统管理 --- 菜单管理 **************** //

export const queryAllMenu = baseModuleUrl + 'queryAllMenu'

export const saveMenu = baseModuleUrl + 'saveMenu'

export const updateMenu = baseModuleUrl + 'updateMenu'

export const deleteMenu = baseModuleUrl + 'deleteMenu'

// ****************系统管理 --- 菜单管理 **************** //

// ****************系统管理 --- 按钮管理 **************** //

export const queryAllButtonInMenu = baseModuleUrl + 'queryAllButtonInMenu'

export const saveMenuButton = baseModuleUrl + 'saveMenuButton'

export const deleteMenuButton = baseModuleUrl + 'deleteMenuButton'

export const updateMenuButton = baseModuleUrl + 'updateMenuButton'

export const queryAllUser = baseModuleUrl + 'queryAllUser'

export const queryAllUserLike = baseModuleUrl + 'queryAllUserLike'

export const queryMenuAndButtonByUser = baseModuleUrl + 'queryMenuAndButtonByUser'

export const grantButtonToUser = baseModuleUrl + 'grantButtonToUser'

// ****************系统管理 --- 按钮管理 **************** //

// ****************系统管理 --- 学习卡管理 **************** //

export const queryStudyCard = baseModuleUrl + 'queryStudyCard'

export const queryStudyCardLike = baseModuleUrl + 'queryStudyCardLike'

export const saveStudyCard = baseModuleUrl + 'saveStudyCard'

export const uploadStudyCardExcel = baseModuleUrl + 'uploadStudyCardExcel'

export const queryAllTextBookAndStudyCard = baseModuleUrl + 'queryAllTextBookAndStudyCard'

export const queryTextBookByStudyCardId = baseModuleUrl + 'queryTextBookByStudyCardId'

export const studyCardAssignedTextBook = baseModuleUrl + 'studyCardAssignedTextBook'

export const editStudyCardInfo = baseModuleUrl + 'editStudyCardInfo'

// ****************系统管理 --- 学习卡管理 **************** //

// ****************系统管理 --- 日志管理 **************** //

export const queryUserLogs = baseModuleUrl + 'queryUserLogs'

export const queryUserLogsByUserId = baseModuleUrl + 'queryUserLogsByUserId'

// ****************系统管理 --- 日志管理 **************** //

// ****************系统管理 --- 意见反馈管理 **************** //

export const queryAllFeedBackList = baseModuleUrl + 'queryAllFeedBackList'

export const queryFeedBackReplyList = baseModuleUrl + 'queryFeedBackReplyList'

export const saveFeedBackReply = baseModuleUrl + 'saveFeedBackReply'

// ****************系统管理 --- 意见反馈管理 **************** //

// ****************会员管理 --- 学校管理 **************** //

export const querySchoolList = baseModuleUrl + 'querySchoolList'

export const querySchoolListLike = baseModuleUrl + 'querySchoolListLike'

export const saveSchoolAndStudyCard = baseModuleUrl + 'saveSchoolAndStudyCard'

export const lockSchool = baseModuleUrl + 'lockSchool'

export const unLockSchool = baseModuleUrl + 'unLockSchool'

export const queryStudyCardBySchoolId = baseModuleUrl + 'queryStudyCardBySchoolId'

export const updateSchool = baseModuleUrl + 'updateSchool'

export const querySchoolBySchoolId = baseModuleUrl + 'querySchoolBySchoolId'

export const querySchoolRecordList = baseModuleUrl + 'querySchoolRecordList'

export const addSchoolRecord = baseModuleUrl + 'addSchoolRecord'

export const queryStudyCardNotBind = baseModuleUrl + 'queryStudyCardNotBind'

export const queryTextBookOfflineSchool = baseModuleUrl + 'queryTextBookOfflineSchool'

export const grantTextBooksToSchool = baseModuleUrl + 'grantTextBooksToSchool'

// ****************会员管理 --- 学校管理 **************** //

// ****************会员管理 --- 老师管理 **************** //

export const queryTeacherList = baseModuleUrl + 'queryTeacherList'

export const queryTeacherListLike = baseModuleUrl + 'queryTeacherListLike'

export const saveTeacher = baseModuleUrl + 'saveTeacher'

export const updateTeacher = baseModuleUrl + 'updateTeacher'

export const lockTeacher = baseModuleUrl + 'lockTeacher'

export const unLockTeacher = baseModuleUrl + 'unLockTeacher'

export const initPassword = baseModuleUrl + 'initPassword'

// ****************会员管理 --- 老师管理 **************** //

// ****************会员管理 --- 班级管理 **************** //

export const querySchoolClass = baseModuleUrl + 'querySchoolClass'

export const querySchoolClassLike = baseModuleUrl + 'querySchoolClassLike'

export const saveSchoolClass = baseModuleUrl + 'saveSchoolClass'

export const editSchoolClass = baseModuleUrl + 'editSchoolClass'

export const lockSchoolClass = baseModuleUrl + 'lockSchoolClass'

export const unLockSchoolClass = baseModuleUrl + 'unLockSchoolClass'

// ****************会员管理 --- 班级管理 **************** //

// ****************会员管理 --- 学生管理 **************** //

export const queryStudentList = baseModuleUrl + 'queryStudentList'

export const queryStudentListLike = baseModuleUrl + 'queryStudentListLike'

export const saveStudent = baseModuleUrl + 'saveStudent'

export const updateStudent = baseModuleUrl + 'updateStudent'

export const lockStudent = baseModuleUrl + 'lockStudent'

export const unLockStudent = baseModuleUrl + 'unLockStudent'

export const initStudentPassword = baseModuleUrl + 'initStudentPassword'

export const studentAssignedTextBook = baseModuleUrl + 'studentAssignedTextBook'

export const getAllTextBookAndStudent = baseModuleUrl + 'getAllTextBookAndStudent'

// ****************会员管理 --- 学生管理 **************** //

// ****************教材信息**************** //

export const queryTextBookList = baseModuleUrl + 'queryTextBookList'

export const queryTextBookListLike = baseModuleUrl + 'queryTextBookListLike'

export const saveTextBook = baseModuleUrl + 'saveTextBook'

export const updateTextBook = baseModuleUrl + 'updateTextBook'

export const deleteTextBook = baseModuleUrl + 'deleteTextBook'

export const querySchoolByTextBookId = baseModuleUrl + 'querySchoolByTextBookId'

export const uploadTextBookExcelTemplate = baseModuleUrl + 'uploadTextBookExcelTemplate'

export const importTextBook = baseModuleUrl + 'importTextBook'

export const uploadTextBookWordTxt = baseModuleUrl + 'uploadTextBookWordTxt'

export const uploadTextBookEgsTxt = baseModuleUrl + 'uploadTextBookEgsTxt'

export const importAudioAndImage = baseModuleUrl + 'importAudioAndImage'

export const wordZipResourceFile = baseModuleUrl + 'wordZipResourceFile'

export const updateImageName = baseModuleUrl + 'updateImageName'

export const grantTextBookToSchool = baseModuleUrl + 'grantTextBookToSchool'

export const cancelGrantTextBookToSchool = baseModuleUrl + 'cancelGrantTextBookToSchool'

export const queryTextBookProgressNo = baseModuleUrl + 'queryTextBookProgressNo'

// ****************教材信息**************** //

// ****************课程信息**************** //

export const queryCourseByTextBook = baseModuleUrl + 'queryCourseByTextBook'

export const queryCourseLevel = baseModuleUrl + 'queryCourseLevel'

export const queryCourseLevelGroup = baseModuleUrl + 'queryCourseLevelGroup'

export const udpateGroupVideoUrl = baseModuleUrl + 'udpateGroupVideoUrl'

// ****************课程信息**************** //

// ****************单词信息**************** //

export const queryWordInfoList = baseModuleUrl + 'queryWordInfoList'

export const queryWordInfoListLike = baseModuleUrl + 'queryWordInfoListLike'

export const queryCourseLevelGroup1 = baseModuleUrl + 'queryCourseLevelGroup'

// ****************单词信息**************** //

// ****************奖品管理 抽奖设置**************** //

export const queryPrizeList = baseModuleUrl + 'queryPrizeList'

export const savePrize = baseModuleUrl + 'savePrize'

export const savePrizeDetail = baseModuleUrl + 'savePrizeDetail'

export const setIsEnable = baseModuleUrl + 'setIsEnable'

export const queryPrizeDetailList = baseModuleUrl + 'queryPrizeDetailList'

export const updatePrize = baseModuleUrl + 'updatePrize'

export const deletePrize = baseModuleUrl + 'deletePrize'

// ****************奖品管理 抽奖设置**************** //
