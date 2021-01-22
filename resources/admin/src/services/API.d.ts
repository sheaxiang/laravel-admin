declare namespace API {
  export type CurrentUser = {
    avatar?: string;
    name?: string;
    user_name?: string;
    status?: string;
    token?: string;
    id?: number;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;

    menus?: array
  };

  export type LoginStateType = {
    status?: 'ok' | 'error';
    type?: string;
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
}
