import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 语言字典
const resources = {
  zh: {
    translation: {
      // 应用标题
      appTitle: 'MeetWhen',
      
      // 搜索框
      searchPlaceholder: '搜索城市...',
      
      // 添加联系人
      addContact: '添加联系人',
      enterContactName: '输入联系人姓名 (如: 客户A, 导师)',
      pleaseEnterName: '请先输入联系人姓名',
      // 弹窗标题
      alertTitle: '提示',
      
      // 设置
      settings: '设置',
      use24Hour: '使用 24 小时制',
      language: '语言',
      chinese: '中文',
      english: '英文',
      
      // 底部控制栏
      currentTime: '当前时间',
      resetToNow: '回到现在',
      
      // 加载
      loading: '加载中...',
      
      // 时间相关
      hour: '小时',
      // 操作
      delete: '删除',
      // 按钮
      cancel: '取消'
    }
  },
  en: {
    translation: {
      // 应用标题
      appTitle: 'MeetWhen',
      
      // 搜索框
      searchPlaceholder: 'Search city...',
      
      // 添加联系人
      addContact: 'Add Contact',
      enterContactName: 'Enter contact name (e.g: Client A, Mentor)',
      pleaseEnterName: 'Please enter a name first',
      // 弹窗标题
      alertTitle: 'Notice',
      
      // 设置
      settings: 'Settings',
      use24Hour: 'Use 24-hour format',
      language: 'Language',
      chinese: 'Chinese',
      english: 'English',
      
      // 底部控制栏
      currentTime: 'Current time',
      resetToNow: 'Back to now',
      
      // 加载
      loading: 'Loading...',
      
      // 时间相关
      hour: 'hour',
      // 操作
      delete: 'Delete',
      // 按钮
      cancel: 'Cancel'
    }
  }
};

// 初始化 i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh', // 默认语言
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false // React 已经安全地处理了 XSS
    }
  });

export default i18n;