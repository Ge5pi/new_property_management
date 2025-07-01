import { IAttachments } from './IAttachments';
import { IUser } from './IAvatar';
import { IPropertyAPI } from './IProperties';
import { GeneralTags } from './ISettings';
import { IUnitsAPI } from './IUnits';

export interface IParentNote {
  note: number;
}

export declare type INoteAttachments = IAttachments & IParentNote;
export interface INoteAPI {
  id?: string | number;
  title: string;
  description: string;
  associated_property?: IPropertyAPI | number;
  attachments?: Array<INoteAttachments>;
  tags?: number[];
}

export interface ISingleNote extends INoteAPI {
  created_by?: IUser;
  modified_by?: IUser;
  created_at?: string;
  updated_at?: string;
  tag_names?: GeneralTags[];
  associated_property_name?: string;
  associated_property_type_name?: string;
  modified_by_full_name?: string;
  created_by_full_name?: string;
}

export interface IContactAPI {
  id?: string | number;
  name: string;
  category: number;
  primary_contact: string;
  secondary_contact?: string;
  email?: string;
  website?: string;
  street_address?: string;
  display_to_tenants: boolean;
  selective: boolean;
}

export interface ISingleContact extends IContactAPI {
  category_name?: string;
}

export declare type RecipientType = 'INDIVIDUAL' | 'PROPERTY';
export declare type IndividualRecipientType = 'TENANT' | 'OWNER' | 'VENDOR';
export interface IEmailTemplateAPI {
  id?: string | number;
  recipient_type: RecipientType;
  individual_recipient_type?: IndividualRecipientType;
  tenants?: Array<number>;
  owners?: Array<number>;
  vendors?: Array<number>;
  units?: Array<number>;
  subject: string;
  signature?: number;
  body: string;
}

export interface IEmailSingleTemplate extends IEmailTemplateAPI {
  recipient_emails?: string[];
  created_at?: string;
}

export interface IEmailSignature {
  id?: string | number;
  image?: string;
  text: string;
}

export interface IEmails extends IEmailSingleTemplate {
  created_by?: IUser;
  attachments?: IAttachments[];
  template?: number;
}

export interface IParentAnnouncement {
  announcement: number;
}

export declare type IAnnouncementAttachments = IAttachments & IParentAnnouncement;
export declare type AnnouncementSelection = 'APAU' | 'SPAU' | 'SPSU' | 'APSU';
export interface IAnnouncementAPI {
  id?: string | number;
  title: string;
  body: string;
  send_by_email: boolean;
  selection?: AnnouncementSelection;
  display_on_tenant_portal: boolean;
  display_date: string;
  expiry_date: string;
  properties: Array<number> | Array<IPropertyAPI>;
  units: Array<number> | Array<IUnitsAPI>;
}

export interface ISingleAnnouncement extends IAnnouncementAPI {
  status: string;
  created_at?: string;
}
