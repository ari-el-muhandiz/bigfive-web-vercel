<template>
  <v-card>
    <v-card-title>
      <v-icon
        large
        left
      >
        {{ mdiAccountOutline }}
      </v-icon>
      Personal Info
      <v-spacer />
    </v-card-title>
    <v-form
      ref="form"
      @submit="checkForm"
    >
      <v-card-text>
        <p v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li
              v-for="error in errors"
              :key="error"
            >
              {{ error }}
            </li>
          </ul>
        </p>
        <v-text-field
          v-model="twitterUsername"
          class="mt-5"
          :rules="[rules.required]"
          :placeholder="$t('form.twitterUsername') || 'twitter username'"
          @input="SET_TWITTER_USERNAME"
        />
        <p>{{ $t("form.iam") }} <b>{{ form.age }}</b> {{ $t("form.yearsOld") }}</p>
        <v-slider
          v-model="age"
          color="secondary"
          :hint="form.age < 15 ? $t('form.ageWarning') : ''"
          min="0"
          max="100"
          persistent-hint
          thumb-label
          @change="SET_AGE"
        />
        <p>{{ $t("form.iama") }} <b>{{ form.gender }}</b></p>
        <v-radio-group
          v-model="gender"
        >
          <v-radio
            :label="$t('form.female')"
            color="secondary"
            value="Female"
            :off-icon="mdiRadioboxBlank"
            :on-icon="mdiRadioboxMarked"
          />
          <v-radio
            :label="$t('form.male')"
            color="secondary"
            value="Male"
            :off-icon="mdiRadioboxBlank"
            :on-icon="mdiRadioboxMarked"
          />
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          type="submit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mdiAccountOutline, mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PersonalInfo',
  data: () => ({
    mdiAccountOutline,
    mdiRadioboxBlank,
    mdiRadioboxMarked,
    age: 0,
    twitterUsername: '',
    gender: '',
    isFormValid: false,
    errors: [],
    rules: {
      required: name => !name ? 'The field is required' : ''
    }
  }),
  computed: mapState(['form']),
  mounted () {
    this.$amplitude.getInstance().logEvent('b5.form', { part: 'personal' })
  },
  methods: {
    ...mapMutations(['SET_AGE', 'SUBMIT_FORM', 'SET_TWITTER_USERNAME', 'SET_GENDER']),
    checkForm: function (e) {
      this.errors = []
      if (!this.twitterUsername) {
        this.errors.push('Twitter username is required.')
      }
      if (this.age < 15) {
        this.errors.push('You must be 16 or older')
      }
      if (!this.gender) {
        this.errors.push('Gender is required')
      }

      if (!this.errors.length) {
        this.SET_AGE(this.age)
        this.SET_TWITTER_USERNAME(this.twitterUsername)
        this.SET_GENDER(this.gender)
        this.SUBMIT_FORM()
      }

      e.preventDefault()
    }
  }
}
</script>
