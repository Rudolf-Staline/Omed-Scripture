import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { createRegistry, renderNode, } from "@basekit/core";
import { ButtonView, IconButtonView, ButtonGroupView } from "./primitives/Button";
import { ToggleView, ToggleGroupView } from "./primitives/ToggleGroup";
import { InputView, TextareaView } from "./primitives/Input";
import { TextInputView, NumberInputView, PasswordInputView, SearchInputView, EmailInputView, PhoneInputView, UrlInputView, FileInputView, DropzoneView, DateTimeInputView } from "./primitives/SpecializedInputs";
import { RadioView, RadioGroupView, CheckboxGroupView } from "./primitives/Selection";
import { CalendarView, DatePickerView, TimePickerView } from "./primitives/Calendar";
import { MultiSelectView, ComboboxView, AutocompleteView } from "./primitives/Choice";
import { SliderView, RangeSliderView } from "./primitives/Slider";
import { DateInputView } from "./primitives/DateInput";
import { SelectView } from "./primitives/Select";
import { CheckboxView, SwitchView } from "./primitives/Toggle";
import { TextView, HeadingView } from "./primitives/Text";
import { AvatarView, BadgeView, DividerView, KbdView, LinkView, SpinnerView, } from "./primitives/Misc";
import { ContainerView, GridView, InlineView, ScrollAreaView, SectionView, SplitPaneView, StackView, } from "./layout/Primitives";
import { AppShellView, PageHeaderView, SidebarView, TopbarView, } from "./layout/Shell";
import { PageView } from "./layout/Layouts";
import { CardContentView, CardFooterView, CardHeaderView, CardView, } from "./composition/Card";
import { DrawerView, ModalView } from "./composition/Modal";
import { AccordionView, DropdownView, TabsView, } from "./composition/Disclosure";
import { TooltipView } from "./composition/Tooltip";
import { PopoverView } from "./composition/Popover";
import { PaginationView } from "./navigation/Pagination";
import { BreadcrumbView } from "./navigation/Breadcrumb";
import { TableView, TableHeaderView, TableBodyView, TableRowView, TableHeadView, TableCellView, TableCaptionView, } from "./data/Table";
import { AlertView, CalloutView, EmptyStateView, ErrorStateView, } from "./feedback/Alert";
import { ProgressView, SkeletonView } from "./feedback/Status";
import { DataTableView } from "./data/DataTable";
import { DescriptionListView, ListView, MetricCardView, StatBlockView, TimelineView, } from "./data/Display";
import { FilterBarView, FormActionsView, FormFieldView, FormSectionView, FieldErrorView, FieldHintView, FieldLabelView, FormView, } from "./form/Form";
const c = (component) => component;
/**
 * The default registry maps every declarative component name to its React view.
 * Adding a component = add its `XView` here (and export its factory).
 */
const registryApi = createRegistry({
    // primitives
    Button: c(ButtonView),
    IconButton: c(IconButtonView),
    ButtonGroup: c(ButtonGroupView),
    Toggle: c(ToggleView),
    ToggleGroup: c(ToggleGroupView),
    Input: c(InputView),
    TextInput: c(TextInputView),
    NumberInput: c(NumberInputView),
    PasswordInput: c(PasswordInputView),
    SearchInput: c(SearchInputView),
    EmailInput: c(EmailInputView),
    PhoneInput: c(PhoneInputView),
    UrlInput: c(UrlInputView),
    FileInput: c(FileInputView),
    Dropzone: c(DropzoneView),
    Textarea: c(TextareaView),
    DateInput: c(DateInputView),
    DateTimeInput: c(DateTimeInputView),
    Calendar: c(CalendarView),
    DatePicker: c(DatePickerView),
    TimePicker: c(TimePickerView),
    Select: c(SelectView),
    MultiSelect: c(MultiSelectView),
    Combobox: c(ComboboxView),
    Autocomplete: c(AutocompleteView),
    Radio: c(RadioView),
    RadioGroup: c(RadioGroupView),
    Checkbox: c(CheckboxView),
    CheckboxGroup: c(CheckboxGroupView),
    Switch: c(SwitchView),
    Slider: c(SliderView),
    RangeSlider: c(RangeSliderView),
    Text: c(TextView),
    Heading: c(HeadingView),
    Badge: c(BadgeView),
    Link: c(LinkView),
    Avatar: c(AvatarView),
    Divider: c(DividerView),
    Kbd: c(KbdView),
    Spinner: c(SpinnerView),
    // layout
    Stack: c(StackView),
    Inline: c(InlineView),
    Grid: c(GridView),
    Container: c(ContainerView),
    Section: c(SectionView),
    ScrollArea: c(ScrollAreaView),
    SplitPane: c(SplitPaneView),
    AppShell: c(AppShellView),
    Sidebar: c(SidebarView),
    Topbar: c(TopbarView),
    PageHeader: c(PageHeaderView),
    Page: c(PageView),
    // composition
    Card: c(CardView),
    CardHeader: c(CardHeaderView),
    CardContent: c(CardContentView),
    CardFooter: c(CardFooterView),
    Modal: c(ModalView),
    Drawer: c(DrawerView),
    Tabs: c(TabsView),
    Accordion: c(AccordionView),
    Dropdown: c(DropdownView),
    Tooltip: c(TooltipView),
    Popover: c(PopoverView),
    // navigation
    Pagination: c(PaginationView),
    Breadcrumb: c(BreadcrumbView),
    // feedback
    Alert: c(AlertView),
    Callout: c(CalloutView),
    EmptyState: c(EmptyStateView),
    ErrorState: c(ErrorStateView),
    Skeleton: c(SkeletonView),
    Progress: c(ProgressView),
    // data
    DataTable: c(DataTableView),
    Table: c(TableView),
    TableHeader: c(TableHeaderView),
    TableBody: c(TableBodyView),
    TableRow: c(TableRowView),
    TableHead: c(TableHeadView),
    TableCell: c(TableCellView),
    TableCaption: c(TableCaptionView),
    MetricCard: c(MetricCardView),
    StatBlock: c(StatBlockView),
    List: c(ListView),
    DescriptionList: c(DescriptionListView),
    Timeline: c(TimelineView),
    // form
    Form: c(FormView),
    FormSection: c(FormSectionView),
    FormField: c(FormFieldView),
    FieldLabel: c(FieldLabelView),
    FieldHint: c(FieldHintView),
    FieldError: c(FieldErrorView),
    FormActions: c(FormActionsView),
    FilterBar: c(FilterBarView),
});
export const defaultRegistry = registryApi.registry;
/** Register (or override) a component in the default registry at runtime. */
export const registerComponent = (name, component) => registryApi.register(name, component);
export const registerComponents = registryApi.registerMany;
/** React component that renders a declarative node tree with the default registry. */
export const RenderNode = ({ node, registry = defaultRegistry, }) => _jsx(_Fragment, { children: renderNode(node, registry) });
//# sourceMappingURL=registry.js.map