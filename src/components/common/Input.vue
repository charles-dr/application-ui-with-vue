<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { useGlobalState } from "@/store/global";
import { masker, tokens } from "@/directives/mask";
import { useClipboard } from "@vueuse/core";
import { log } from "@/lib/utils";

const themeOverrides = computed(() => {
    return {
        Input: {
            borderRadius: "5px",
        },
        Select: {
            peers: {
                InternalSelection: {
                    borderRadius: "5px",
                },
            },
        },
    };
});

const props = defineProps({
    editable: Boolean,
    copyable: Boolean,
    disabled: Boolean,
    debounce: Number,
    label: String,
    mask: String,
    placeholder: String,
    status: String,
    type: String,
    rules: Array,
    prefix: String,
    suffix: String,
    value: [String, Number, Array, Object],
});

const emit = defineEmits([
    "blur",
    "clear",
    "focus",
    "input",
    "enter",
    "debounced",
    "typing",
    "edit",
    "cancel",
    "save",
    "update:value",
]);

const global = useGlobalState();
const message = useMessage();
const { copy } = useClipboard();

const inputEl = ref();
const selectEl = ref();
const defaultTextareaHeight = ref("42px");
const copyHover = false;

const inputState = reactive({
    disabled: false,
    hovering: false,
    focused: false,
    typing: false,
    isValid: null,
    status: null,
    inner: null,
});

// `editableState` shares the same state as `inputState`, but not vice versa

const editableState = reactive({
    hovering: false,
    editing: false,
    focused: false,
    done: false,
    saved: false,
    lastSaved: null,
    height: null,
});

// Debounce can be set as prop and handled on emit `@debounced`

watchEffect((onInvalidate) => {
    if (hasProp("debounce")) {
        if (props.value?.length > 0) {
            inputState.typing = true;
            emit("typing");
            const updateTypingStatus = setTimeout(() => {
                inputState.typing = false;
                emit("debounced");
            }, props.debounce);
            onInvalidate(() => {
                clearTimeout(updateTypingStatus);
            });
        } else {
            inputState.typing = false;
        }
    }
});

watch(
    () => editableState.editing,
    (val) => {
        inputState.inner.style.paddingRight = val ? "52px" : "0px";
    }
);

watch(
    () => inputState.isValid,
    (val) => {
        if (!props.status) {
            inputState.status = val ? "" : "error";
        }
    }
);

onMounted(() => {
    inputState.isValid = validate(props.value);
    editableState.lastSaved = props.value;

    var target;

    if (props.type === "select") {
        target = selectEl.value?.$el;
    } else {
        target = inputEl.value?.$el;
    }

    if (props.type === "textarea") {
        editableState.height = target?.offsetHeight + "px";
    }

    if (hasProp("status")) {
        inputState.status = props.status;
    }

    if (hasProp("editable")) {
        var innerTarget;
        if (props.type === "textarea") {
            innerTarget = target?.querySelector("textarea");
        } else {
            innerTarget = target?.querySelector("input");
        }
        inputState.disabled = props.disabled || !editableState.editing;
        inputState.inner = innerTarget;
        inputState.inner.style.transition = "150ms";
        inputState.inner.style.textOverflow = "ellipsis";
        inputState.inner.style.paddingRight =
            editableState.editing || editableState.focused ? "52px" : "0px"; // avoid text overlapping with control buttons
    } else {
        inputState.disabled = false;
    }
});

function validate(input) {
    if (props.rules && props.rules.length > 0) {
        let tests = [];
        props.rules?.forEach((test) => tests.push(global.validators[test](input)));
        return props.rules?.length === tests.filter((test) => test)?.length;
    }
    return true;
}

function hasProp(prop) {
    return props[prop] ?? props[prop]?.length > 0;
}

// --- masks ---

function refreshMask(value) {
    const val = masker(value, props.mask, true, tokens);
    emit("update:value", val);
}

// --- handle enter key press ---

function onKeyUp(e) {
    if (props.editable && e.keyCode === 13) {
        // save on enter
        e.preventDefault();
        save();
    }
    if (props.editable && e.keyCode === 27) {
        // cancel on esc
        e.preventDefault();
        cancel();
    }
}

// --- handle hover events ---

function onMouseLeave(e) {
    inputState.hovering = false;
}

function onMouseEnter(e) {
    if (!hasProp("disabled")) {
        inputState.hovering = true;
    }
}

function onEditableMouseLeave(e) {
    editableState.hovering = false;
}

function onEditableMouseEnter(e) {
    editableState.hovering = true;
}

// --- handle n-input events ---

function onUpdate(e) {
    if (hasProp("mask")) {
        const val = masker(e, props.mask, true, tokens);
        inputState.isValid = validate(val);
        emit("update:value", val);
    } else {
        inputState.isValid = validate(e);
        emit("update:value", e);
    }
}

function onFocus(e) {
    emit("focus", e);
    inputState.focused = true;
}

function onBlur(e) {
    inputState.focused = false;
    if (props.editable) {
        // TODO : differenciate 'Save' of this instance vs other instances
        if (props.editable) {
            if (e.relatedTarget?.classList.contains("Save")) save();
            else cancel();
        }
    }
}

function handleMousedown(e) {
    const target = inputEl.value?.$el || selectEl.value?.$el;
    if (props.type === "textarea") {
        editableState.height = target.offsetHeight + "px";
    } else {
        editableState.height = "42px";
    }
}

function handleMouseup(e) {
    const target = inputEl.value?.$el || selectEl.value?.$el;
    if (props.type === "textarea") {
        editableState.height = target.offsetHeight + "px";
    } else {
        editableState.height = "42px";
    }
}

// --- handle editable events ---

function cancel() {
    emit("cancel");
    emit("update:value", editableState.lastSaved); // setting last saved value at Input level
    validate(editableState.lastSaved);
    editableState.focused = false;
    editableState.editing = false;
    editableState.done = true;
    inputState.disabled = true;
    if (inputEl.value) inputEl.value.blur();
    if (selectEl.value) selectEl.value.blur();
    setTimeout(() => (editableState.done = false), 500);
}

function edit() {
    emit("edit");
    editableState.focused = true;
    editableState.editing = true;
    editableState.saved = false;
    editableState.done = false;
    inputState.disabled = false;
    setTimeout(() => {
        if (inputEl.value) inputEl.value.focus();
        if (selectEl.value) selectEl.value.focus();
    }, 250);
}

function save() {
    log("saving...");
    if (inputState.isValid) {
        emit("save");
        editableState.focused = false;
        editableState.editing = false;
        editableState.lastSaved = props.value;
        editableState.done = true;
        editableState.disabled = true;
        editableState.saved = true;
        if (inputEl.value) inputEl.value.blur();
        if (selectEl.value) selectEl.value.blur();
        setTimeout(() => (editableState.saved = false), 1000);
        setTimeout(() => (editableState.done = false), 500);
    } else {
        message.error("Invalid input");
        inputState.status = "error";
        setTimeout(edit(), 300);
    }
}

function handleCopy() {
    copy(props.value);
    message.success("Copied to clipboard");
}

// --- dynamic classes/styles ---

const statusColor = computed(() => {
    const darkLight = (d, l) =>
        global.isDark ? (inputState.focused ? d : "#303033") : l;
    switch (inputState.status) {
        case "warning":
            return darkLight("#2E2A26", inputState.disabled ? "#fafafc" : "#ffffff");
        case "error":
            return darkLight("#2D2226", inputState.disabled ? "#fafafc" : "#ffffff");
        default:
            return darkLight(
                inputState.disabled ? "#262629" : "#202C2C",
                inputState.disabled ? "#fafafc" : "#ffffff"
            );
    }
});

const hideUntilActive = computed(() => {
    return `
    ${
        editableState.editing || !editableState.hovering
            ? "pointer-events-none scale-0 !opacity-0 duration-200"
            : "opacity-100 duration-100"
    }
  `;
});

const editableOverlay = computed(() => {
    return `
    ${
        editableState.editing || editableState.focused
            ? "translate-x-[-68px] w-[68px]"
            : "translate-x-[0px] !w-full"
    }
    ${editableState.saved && "ping"}
  `;
});

const requiredIndicator = computed(() => {
    if (!(props.rules?.includes("required") && (!props.value || props.value === ""))) {
        return "mr-[-10px] scale-50 !opacity-0";
    }
});

const labelMask = computed(() => {
    return hasProp("status") ||
        !inputState.isValid ||
        inputState.focused ||
        inputState.hovering
        ? "opacity-1 duration-[200ms]"
        : global.isDark && "opacity-0 duration-[0ms] delay-[200ms]";
});
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div>
            <div v-if="hasProp('label')" class="relative" style="height: inherit">
                <label class="Label">
                    <b class="text-red-600 duration-[300ms]" :class="requiredIndicator">
                        *
                    </b>
                    <span>{{ label || "" }}</span>
                    <div
                        style="z-index: -2; width: 100%"
                        :style="`background: ${statusColor}`"
                        class="absolute translate-x-[-9px]"
                        :class="`${labelMask} ${
                            editableState.editing || inputState.focused
                                ? 'h-[6px] dark:h-[2px] translate-y-[-10px] dark:translate-y-[-8px]'
                                : 'h-[4px] dark:h-[2px] translate-y-[-8px]'
                        }`"
                    ></div>
                </label>
            </div>
            <div
                v-if="hasProp('editable')"
                class="Editable-overlay relative z-50 h-[inherit]"
                :class="(editableState.editing || editableState.focused) && 'float-right'"
            >
                <div
                    class="absolute flex items-start pt-[10px] justify-end"
                    :class="editableOverlay"
                    :style="`height:${
                        editableState.height ||
                        (props.type === 'textarea' ? defaultTextareaHeight : '42px')
                    }`"
                    @mouseenter="onEditableMouseEnter"
                    @mouseleave="onEditableMouseLeave"
                >
                    <div
                        v-if="!editableState.saved"
                        class="absolute w-[50%] h-[calc(100%-2px)] translate-y-[-9px] translate-x-[-1px] bg-gradient-to-r rounded-round from-transparent to-[#fafafc] duration-[200ms]"
                        :class="`
            ${
                !editableState.editing && editableState.hovering
                    ? 'opacity-1'
                    : 'opacity-0'
            }

          `"
                        style="z-index: -1"
                        :style="
                            global.isDark &&
                            `background:linear-gradient(90deg, transparent, #262629)`
                        "
                    ></div>

                    <div class="mr-[12px] flex items-center">
                        <!-- copy -->
                        <button
                            ref="copyButton"
                            @click="handleCopy"
                            class="Edit h-3 w-3 -translate-x-3 rounded-full dark:hover:opacity-50"
                            :class="hideUntilActive"
                        >
                            <svg
                                class="fill-black dark:fill-white hover:fill-success"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                                ></path>
                            </svg>
                        </button>
                        <!-- edit -->
                        <button
                            ref="editButton"
                            @click="edit"
                            class="Edit h-3 w-3 -translate-x-1 rounded-full dark:hover:opacity-50"
                            :class="hideUntilActive"
                        >
                            <svg
                                class="fill-black dark:fill-white hover:fill-success"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
                                ></path>
                            </svg>
                        </button>
                        <!-- save -->
                        <button
                            ref="saveButton"
                            @click="save"
                            :style="!editableState.editing && 'width: 0px !important'"
                            class="Save h-5 w-5 duration-200"
                            :class="`
                ${!inputState.isValid && 'pointer-events-none'}
                ${
                    !editableState.editing
                        ? 'pointer-events-none !scale-50 opacity-0'
                        : 'opacity-100 delay-100'
                }
              `"
                        >
                            <svg
                                class="duration-200"
                                :class="
                                    !inputState.isValid
                                        ? 'fill-gray-200 dark:opacity-[0.1]'
                                        : 'fill-success dark:hover:brightness-[1.5] hover:brightness-[1.1]'
                                "
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm3.22 6.97l-4.47 4.47l-1.97-1.97a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5-5a.75.75 0 1 0-1.06-1.06z"
                                ></path>
                            </svg>
                        </button>
                        <!-- cancel -->
                        <button
                            ref="cancelButton"
                            @click="cancel"
                            :style="!editableState.editing && 'width: 0px !important'"
                            class="Cancel ml-1 h-5 w-5 duration-200"
                            :class="
                                !editableState.editing
                                    ? 'pointer-events-none !scale-50 opacity-0 delay-100'
                                    : 'opacity-100'
                            "
                        >
                            <svg
                                class="duration-200 rotate-45 fill-gray-400 hover:fill-black dark:hover:fill-white"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 5a.75.75 0 0 0-.743.648l-.007.102v3.5h-3.5a.75.75 0 0 0-.102 1.493l.102.007h3.5v3.5a.75.75 0 0 0 1.493.102l.007-.102v-3.5h3.5a.75.75 0 0 0 .102-1.493l-.102-.007h-3.5v-3.5A.75.75 0 0 0 12 7z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="copyable" class="relative">
                <button
                    ref="copyButton"
                    class="Edit h-3 w-3 absolute right-0 -translate-x-4 translate-y-[14px] rounded-full dark:hover:opacity-50 z-50"
                    :class="
                        inputState.focused
                            ? 'opacity-100 duration-100'
                            : 'scale-0 !opacity-0 duration-200'
                    "
                    @click="handleCopy"
                >
                    <svg
                        class="fill-black dark:fill-white hover:fill-success"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        ></path>
                    </svg>
                </button>
            </div>
            <!-- basic input, textarea -->
            <n-input
                v-if="!type || type === 'textarea'"
                ref="inputEl"
                v-bind="$attrs"
                class="innerInput truncate"
                :class="
                    editable && !editableState.editing
                        ? 'pointer-events-none'
                        : 'pointer-events-all'
                "
                :disabled="disabled || (editable && !editableState.editing)"
                :mask="mask"
                :placeholder="placeholder || mask || ''"
                :status="inputState.status"
                :value="value"
                :type="type"
                @blur="onBlur"
                @focus="onFocus"
                @keyup="onKeyUp"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @update:value="onUpdate"
                @mousedown="handleMousedown"
                @mouseup="handleMouseup"
                @input="(e) => $emit('input', e)"
                @clear="(e) => $emit('clear', e)"
            >
                <template #prefix>{{ prefix }}</template>
                <template #suffix>{{ suffix }}</template>
            </n-input>
            <!-- select -->
            <n-select
                v-if="type === 'select'"
                ref="selectEl"
                v-bind="$attrs"
                class="innerSelect"
                :class="
                    editable && !editableState.editing
                        ? 'pointer-events-none'
                        : 'pointer-events-all'
                "
                :disabled="disabled || (editable && !editableState.editing)"
                :placeholder="placeholder || ''"
                :status="inputState.status"
                :value="value"
                @blur="onBlur"
                @focus="onFocus"
                @keyup="onKeyUp"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
                @update:value="onUpdate"
                @mousedown="handleMousedown"
                @mouseup="handleMouseup"
                @input="(e) => $emit('input', e)"
                @clear="(e) => $emit('clear', e)"
            >
                <template #prefix>{{ prefix }}</template>
                <template #suffix>{{ suffix }}</template>
            </n-select>
        </div>
    </n-config-provider>
</template>

<style lang="scss" scoped>
.Label {
    @apply absolute z-40 translate-x-[8px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light;
}
.innerInput {
    @apply p-[4px] w-full;
}
.innerSelect {
    :deep(.n-base-selection .n-base-selection-label) {
        padding: 21px 0px 21px 0px;
    }
}
button {
    cursor: pointer;
}
.ping {
    animation: ping 1.5s ease forwards;
}
@keyframes ping {
    from {
        @apply bg-success/[0.3];
    }
    to {
        @apply bg-transparent;
    }
}
</style>
