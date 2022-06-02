<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { NInput, NSelect, NConfigProvider } from "naive-ui";
import { useMessage } from "naive-ui";
import { useClipboard } from "@vueuse/core";
import { useGlobalState } from "@/store/global";
import { log } from "@/lib/utils";

const message = useMessage();

const global = useGlobalState();

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
  },
  placement: {
    type: String,
    default: "bottom-start",
  },
  tag: {
    type: Boolean,
    default: false,
  },
  maxTagCount: {
    type: [Number, String],
    default: undefined,
  },
  placeholder: {
    type: String,
    default: "Please Select",
  },
  fallbackOption: {
    type: [Boolean, Function],
    default: false,
  },
  renderLabel: {
    type: Function,
    default: undefined,
  },
  renderOption: {
    type: Function,
    default: undefined,
  },
  renderTag: {
    type: Function,
    default: undefined,
  },
  resetMenuOnOptionsChange: {
    type: Boolean,
    default: true,
  },
  onChange: {
    type: Function,
    default: undefined,
  },
  onSearch: {
    type: Function,
    default: undefined,
  },
  onCreate: {
    type: Function,
    default: undefined,
  },
  onScroll: {
    type: Function,
    default: undefined,
  },
});

const emit = defineEmits([
  "blur",
  "change",
  "clear",
  "focus",
  "input",
  "enter",
  "debounced",
  "typing",
  "update:value",
]);

const inputState = reactive({
  hovering: false,
  focused: false,
  typing: false,
});

const editableState = reactive({
  hovering: false,
  editing: false,
  done: false,
  saved: false,
});

const { text, copy } = useClipboard();

const statusColor = computed(() => {
  const darkLight = (d, l) => (global.isDark ? (inputState.focused ? d : "#303033") : l);
  switch (props.status) {
    case "warning":
      return darkLight("#2E2A26", "#ffffff");
    case "error":
      return darkLight("#2D2226", "#ffffff");
    default:
      return darkLight("#202C2C", "#ffffff");
  }
});

watchEffect((onInvalidate) => {
  if (props.value?.length > 0 && hasProp("debounce")) {
    inputState.typing = true;
    emit("typing");
    const updateTypingStatus = setTimeout(() => {
      log.cyan("waiting to fetch...");
      inputState.typing = false;
      emit("debounced");
    }, props.debounce);
    onInvalidate(() => {
      log.yellow("invalidated");
      clearTimeout(updateTypingStatus);
    });
  }
});

function hasProp(prop) {
  return props[prop] ?? props[prop]?.length > 0;
}

function onBlur(e) {
  inputState.focused = false;
  emit("blur", e);
}

function onFocus(e) {
  inputState.focused = true;
  emit("focus", e);
}

function onKeyUp(e) {
  if (e.keyCode === 13) {
    log.green("pressed enter key: ", e.target.value);
    emit("enter", e);
  }
}

function onMouseLeave() {
  inputState.hovering = false;
}

function onMouseEnter() {
  log.green("hovering");
  if (!hasProp("disabled")) inputState.hovering = true;
}

function onEditableMouseLeave() {
  editableState.hovering = false;
}

function onEditableMouseEnter() {
  log.yellow("editable hovering");
  editableState.hovering = true;
}

function handleCopy() {
  copy(props.value);
  message.success("Copied to clipboard");
}
</script>

<template>
  <div>
    <div class="relative">
      <label
        class="absolute z-40 translate-x-[12px] translate-y-[-6px] bg-transparent px-2 text-[9px] font-medium uppercase tracking-widest text-gray-600 dark:text-background_light"
      >
        <span>{{ label || "Label" }}</span>
        <div
          style="z-index: -2; width: calc(100% + 2px)"
          class="absolute h-[2px] translate-x-[-9px] translate-y-[-10px] dark:translate-y-[-8px]"
          :class="
            hasProp('status') || inputState.focused || inputState.hovering
              ? 'opacity-1 duration-[200ms]'
              : 'opacity-0 delay-[200ms] duration-[0ms]'
          "
          :style="`background: ${statusColor}`"
        ></div>
      </label>
    </div>
    <div v-if="hasProp('editable')" class="relative">
      <div
        class="__editable-overlay absolute flex h-[42px] w-full items-center justify-end pl-[12px]"
        @mouseenter="onEditableMouseEnter"
        @mouseleave="onEditableMouseLeave"
      >
        <div
          class="mr-[12px] duration-[200ms]"
          :class="!editableState.hovering && 'pointer-events-none opacity-0'"
        >
          <!-- copy -->
          <button
            ref="copyButton"
            @click="handleCopy"
            class="__edit h-3 w-3 -translate-x-3 rounded-full dark:hover:opacity-50"
            :class="`
                      ${
                        editableState.editing
                          ? 'pointer-events-none scale-0 !opacity-0 duration-200'
                          : 'opacity-100 duration-100'
                      }
                      ${editableState.done && 'delay-[250ms]'}
                  `"
          >
            <svg
              class="fill-black hover:fill-success dark:fill-white"
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
            class="__edit h-3 w-3 -translate-x-1 rounded-full dark:hover:opacity-50"
            :class="`
                      ${
                        editableState.editing
                          ? 'pointer-events-none scale-50 opacity-0 duration-200'
                          : 'opacity-100 duration-100'
                      }
                      ${editableState.done && 'delay-[250ms]'}
                  `"
          >
            <svg
              class="fill-black hover:fill-success dark:fill-white"
              viewBox="0 0 24 24"
            >
              <path
                d="M13.94 5L19 10.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <n-select
      class="w-full py-[4px] pr-[4px] pl-[4px]"
      :class="
        hasProp('editable') && !editableState.editing
          ? 'pointer-events-none'
          : 'pointer-events-all'
      "
      :autofocus="autofocus"
      :autosize="autosize"
      :clearable="clearable"
      :default-value="defaultValue"
      :disabled="disabled"
      :input-props="inputProps"
      :loading="loading"
      :maxlength="maxlength"
      :minlength="minlength"
      :pair="pair"
      :passively-activated="passivelyActivated"
      :placeholder="placeholder || ''"
      :readonly="readonly"
      :round="round"
      :rows="rows"
      :separator="separator"
      :show-count="showCount"
      :show-password-on="showPasswordOn"
      :size="size"
      :status="status"
      :type="type"
      :value="value"
      @blur="onBlur"
      @focus="onFocus"
      @keyup="onKeyUp"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @input="(e) => $emit('input', e)"
      @clear="(e) => $emit('clear', e)"
      @change="(e) => $emit('change', e)"
      @update:value="(e) => $emit('update:value', e)"
    />
  </div>
</template>
